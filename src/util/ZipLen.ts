import {Inflater} from './Inflater';

abstract class Indexed {
  abstract getRange(start: number, end: number): ReadableStream<Uint8Array>;

  abstract size(): number;

  async read(target: Uint8Array, start: number, length: number = target.length) {
    let offset = 0;
    let writable = new WritableStream({
      write(chunk: Uint8Array) {
        target.set(chunk, offset);
        offset += chunk.length;
      }
    });

    let stream = this.getRange(start, start + length);
    await stream.pipeTo(writable);
    if (offset !== length) {
      throw Error('Unexpected EOF.');
    }
  }
}

class FileIndexed extends Indexed {
  file: File;

  constructor(file: File) {
    super();
    this.file = file;
  }

  getRange(start: number, end: number): ReadableStream<Uint8Array> {
    const blob = this.file.slice(start, end);
    return blob.stream() as any;
  }

  size(): number {
    return this.file.size;
  }
}

class ZipEntry {
  static EntrySig = 0x02014b50;
  static LocalHeaderSig = 0x04034b50;
  private source: ZipLen;
  filename: string;
  comment: string;
  compressedSize: number;
  originalSize: number;
  offset: number;
  flag: number;
  method: 'deflate' | 'stored';

  constructor(source: ZipLen, filename: string, comment: string, compressedSize: number, originalSize: number,
              offset: number, flag: number, method: number) {
    this.source = source;
    this.filename = filename;
    this.comment = comment;
    this.compressedSize = compressedSize;
    this.originalSize = originalSize;
    this.offset = offset;
    this.flag = flag;

    switch (method) {
      case 0:
        this.method = 'stored';
        break;
      case 8:
        this.method = 'deflate';
        break;
      default:
        throw Error('Unsupported compression method.');
    }
  }

  isEncrypt() {
    return this.flag & 0x0001;
  }

  async focus(): Promise<Uint8Array> {
    const indexed = this.source.indexed;
    const headerBuf = new Uint8Array(30);
    await indexed.read(headerBuf, this.offset);
    const headerView = new DataView(headerBuf.buffer);
    const sig = headerView.getUint32(0, true);
    if (sig !== ZipEntry.LocalHeaderSig) {
      throw Error('Invalid local header signature.');
    }
    const filenameLength = headerView.getUint16(26, true);
    const exFieldLength = headerView.getUint16(28, true);
    const dataStart = this.offset + headerBuf.length + filenameLength + exFieldLength;
    const dataEnd = dataStart + this.compressedSize;
    if (dataEnd > indexed.size()) {
      throw Error(`File data overflows: ${dataStart} + ${this.compressedSize} > ${indexed.size()}`);
    }
    const stream = indexed.getRange(dataStart, dataEnd);
    const reader = stream.getReader();
    const deflated = new Uint8Array(this.compressedSize);
    let deflatedLoc = 0;
    while (true) {
      const {value, done} = await reader.read();
      if (done) break;
      deflated.set(value, deflatedLoc);
      deflatedLoc += value.length;
    }
    if (deflatedLoc !== this.compressedSize) {
      throw Error(`Incorrect bytes to be decompressed. Expect ${this.compressedSize} but get ${deflatedLoc}`);
    }
    if (this.method === 'deflate') {
      const inflater = new Inflater(deflated);
      return inflater.inflate();
    }
    return deflated;
  }
}

class ZipLen {
  indexed: Indexed;
  entryCount = -1;
  private entryCursor = -1;
  private entriesRead = -1;
  private loaded = false;

  // EOCD: End of Central Directory
  static EOCD_BaseSize = 22;
  static EOCD_CommentLimit = 0xffff;
  static EOCD_Sig = 0x06054b50;
  static EOCD64_Sig = 0x06064b50;
  static EOCD64_Locator_Sig = 0x07064b50;

  constructor(indexed: Indexed) {
    this.indexed = indexed;
  }

  async load() {
    const EOCD_size = Math.min(ZipLen.EOCD_BaseSize + ZipLen.EOCD_CommentLimit, this.indexed.size());
    const EOCD_buf = new Uint8Array(EOCD_size);
    const readStart = this.indexed.size() - EOCD_size;

    await this.indexed.read(EOCD_buf, readStart, EOCD_size);

    const dataView = new DataView(EOCD_buf.buffer, 0);
    for (let idx = EOCD_size - ZipLen.EOCD_BaseSize; idx >= 0; idx -= 1) {
      const matched = dataView.getUint32(idx, true) === ZipLen.EOCD_Sig;
      if (!matched) continue;
      const EOCD_view = new DataView(EOCD_buf.buffer, idx);
      const diskNumber = EOCD_view.getUint16(4, true);
      if (diskNumber !== 0) {
        throw Error('Multi-disk zip not supported.');
      }

      const entryCount = EOCD_view.getUint16(10, true);
      const CD_size = EOCD_view.getUint32(12, true);
      const CD_offset = EOCD_view.getUint32(16, true);
      const commentSize = EOCD_view.getUint16(20, true);

      // Comment size sanity check
      const expectedCommentSize = (EOCD_size - idx) - ZipLen.EOCD_BaseSize;
      if (commentSize !== expectedCommentSize) {
        continue;
      }

      const isZip64 = entryCount === 0xffff || CD_offset === 0xffffffff;
      if (!isZip64) {
        // Avoid accidental signature matching in EOCD comments
        const declaredSize = CD_size + CD_offset + (EOCD_size - idx);
        if (declaredSize !== this.indexed.size()) {
          continue;
        }

        this.build(CD_offset, entryCount);
        return;
      }

      // Zip64 support
      const locatorBuf = new Uint8Array(20);
      const locatorOffset = readStart + idx - locatorBuf.length;
      await this.indexed.read(locatorBuf, locatorOffset, locatorBuf.length);
      const locatorView = new DataView(locatorBuf.buffer);
      const locatorSig = locatorView.getUint32(0, true);
      if (locatorSig !== ZipLen.EOCD64_Locator_Sig) {
        throw Error('Invalid zip64 EOCD locator signature.');
      }
      const EOCD64_offset = locatorView.getBigUint64(8, true);
      const EOCD64 = new Uint8Array(56);
      await this.indexed.read(EOCD64, Number(EOCD64_offset));
      const EOCD64_view = new DataView(EOCD64.buffer);
      const EOCD64_sig = EOCD64_view.getUint32(0, true);
      if (EOCD64_sig !== ZipLen.EOCD64_Sig) {
        throw Error('Invalid zip64 EOCD signature.');
      }
      const entryCount64 = EOCD64_view.getBigUint64(32, true);
      const CD_size64 = EOCD64_view.getBigUint64(40, true);
      const CD_offset64 = EOCD64_view.getBigUint64(48, true);

      const declaredSize = Number(CD_size64 + CD_offset64) + 56 + 20 + (EOCD_size - idx);
      if (declaredSize !== this.indexed.size()) {
        continue;
      }
      this.build(Number(CD_offset64), Number(entryCount64));
      return;
    }

    throw Error('Valid EOCD signature not found.');
  }

  private build(CD_offset: number, entryCount: number) {
    this.entryCursor = CD_offset;
    this.entryCount = entryCount;
    this.entriesRead = 0;
    this.loaded = true;
  }

  loadedCheck() {
    if (!this.loaded) throw Error('The zip need to be loaded to access its entries.');
  }

  async entry() {
    this.loadedCheck();
    if (this.entriesRead === this.entryCount) {
      // emit end
    }
    const entryBuf = new Uint8Array(46);
    await this.indexed.read(entryBuf, this.entryCursor);
    this.entryCursor += 46;
    const entryView = new DataView(entryBuf.buffer);

    const entrySig = entryView.getUint32(0, true);
    if (entrySig !== ZipEntry.EntrySig) {
      throw Error('Invalid entry signature.');
    }
    const verMadeBy = entryView.getUint16(4, true);
    const verToUse = entryView.getUint16(6, true);
    const generalFlag = entryView.getUint16(8, true);
    const method = entryView.getUint16(10, true);
    let compressedSize = entryView.getUint32(20, true);
    let originalSize = entryView.getUint32(24, true);
    const filenameLength = entryView.getUint16(28, true);
    const exFieldLength = entryView.getUint16(30, true);
    const fileCommentLength = entryView.getUint16(32, true);
    let localRelative = entryView.getUint32(42, true);

    if (generalFlag & 0x0040) {
      throw Error('Strong encryption not supported.');
    }

    const exLength = filenameLength + exFieldLength + fileCommentLength;
    const exBuf = new Uint8Array(exLength);
    await this.indexed.read(exBuf, this.entryCursor);
    this.entryCursor += exLength;
    const byUtf8 = generalFlag & 0x0800;
    const encode = byUtf8 ? 'utf8' : 'cp437';

    // Filename and sanity check
    const filename = decode(exBuf.slice(0, filenameLength), encode);

    // Extra fields for optional extensions
    const exFieldView = new DataView(exBuf.buffer, filenameLength, exFieldLength);
    const exFields = [];
    let cur = 0;
    while (cur != exFieldLength) {
      const id = exFieldView.getUint16(cur, true);
      const size = exFieldView.getUint16(cur + 2, true);
      if (cur + 4 + size > exFieldLength) {
        throw Error('Extra field oversize as stated.');
      }
      const data = new Uint8Array(exFieldView.buffer);
      exFields.push({id, data});
      cur = cur + 4 + size;
    }

    // Comment
    const comment = decode(exBuf.slice(filenameLength + exFieldLength), encode);
    this.entriesRead += 1;

    // Zip64
    const isZip64 = compressedSize === 0xffffffff ||
      originalSize === 0xffffffff ||
      localRelative === 0xffffffff;

    if (isZip64) {
      let zip64_EIEF_buf = null;
      for (const field of exFields) {
        if (field.id !== 0x0001) continue;
        zip64_EIEF_buf = new DataView(field.data.buffer);
      }
      if (zip64_EIEF_buf === null || zip64_EIEF_buf.byteLength < 28) {
        throw Error('Expected 0x0001 Zip64 EIEF with 28 bytes');
      }
      if (compressedSize === 0xffffffff) {
        compressedSize = Number(zip64_EIEF_buf.getBigUint64(0, true));
      }
      if (originalSize === 0xffffffff) {
        originalSize = Number(zip64_EIEF_buf.getBigUint64(8, true));
      }
      if (localRelative === 0xffffffff) {
        localRelative = Number(zip64_EIEF_buf.getBigUint64(16, true));
      }
    }

    return new ZipEntry(this, filename, comment, compressedSize, originalSize, localRelative, generalFlag, method);
  }

}

const cp437 = '\u0000☺☻♥♦♣♠•◘○◙♂♀♪♫☼►◄↕‼¶§▬↨↑↓→←∟↔▲▼ !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~⌂ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ ';
const utf8Decoder = new TextDecoder();

function decode(buf: Uint8Array, encoding: 'utf8' | 'cp437') {
  switch (encoding) {
    case 'utf8':
      return utf8Decoder.decode(buf);
    case 'cp437':
      let result = '';
      buf.forEach(c => {
        result += cp437[c];
      });
      return result;
  }
}

export {
  ZipLen, FileIndexed, ZipEntry
};
