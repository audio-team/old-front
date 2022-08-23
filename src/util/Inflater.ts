class BitSource {
  private bitValue = 0;
  private len = 0;
  idx = 0;
  private readonly buf: Uint8Array;

  static Mask = [0,
    0x0001, 0x0003, 0x0007, 0x000f,
    0x001f, 0x003f, 0x007f, 0x00ff,
    0x01ff, 0x03ff, 0x07ff, 0x0fff,
    0x1fff, 0x3fff, 0x7fff, 0xffff,
  ];

  constructor(buf: Uint8Array) {
    this.buf = buf;
  }

  private need(n: number) {
    if (n > 32) throw Error('Too many bits needed.');
    while (this.len < n) {
      if (this.idx === this.buf.length) {
        throw Error(`Run out of buffer. Length: ${this.buf.length}, Index: ${this.idx}`);
      }
      this.bitValue |= this.buf[this.idx++] << this.len;
      this.len += 8;
    }
  }

  peek(n: number) {
    this.need(n);
    return this.bitValue & BitSource.Mask[n];
  }

  drop(n: number) {
    this.bitValue >>= n;
    this.len -= n;
  }

  read(n: number) {
    const value = this.peek(n);
    this.drop(n);
    return value;
  }

  byteAlign() {
    const n = this.len & 0b111;
    this.drop(n);
  }

}

type TreeNode = { val?: number, '0'?: TreeNode, '1'?: TreeNode };

class HuffmanTree {
  static BitMax = 16;
  root: TreeNode = {};

  constructor(codeLens: Uint8Array) {

    const count = new Uint16Array(HuffmanTree.BitMax + 1);
    for (const len of codeLens) {
      count[len] += 1;
    }

    let curCode = 0;
    const nextCode = new Uint32Array(HuffmanTree.BitMax + 1);
    for (let bit = 1; bit <= HuffmanTree.BitMax; bit++) {
      curCode += count[bit - 1];
      curCode <<= 1;
      nextCode[bit] = curCode;
    }

    for (let n = 0; n < codeLens.length; n++) {
      let len = codeLens[n];
      if (len != 0) {
        const code = nextCode[len]++;
        let cur = this.root;
        for (let i = len - 1; i >= 0; i--) {
          let val = ((code >> i) & 1) as (0 | 1);
          if (cur[val] === undefined) {
            cur[val] = {};
          }
          cur = cur[val]!;
        }
        cur.val = n;
      }
    }
  }

  static fixedLTree() {
    const codeLens = new Uint8Array(288);
    codeLens.fill(8, 0, 144);
    codeLens.fill(9, 144, 256);
    codeLens.fill(7, 256, 280);
    codeLens.fill(8, 280);
    return new HuffmanTree(codeLens);
  }

  static fixedDTree() {
    const lens = new Uint8Array(32);
    lens.fill(5);
    return new HuffmanTree(lens);
  }
}

class Inflater {

  static cacheSize = 32 * 1024;
  static fixedLTree = HuffmanTree.fixedLTree();
  static fixedDTree = HuffmanTree.fixedDTree();
  static lengthBase = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31,
    35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258];
  static lengthExtra = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2,
    3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0];
  static distanceBase = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193,
    257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577];
  static distanceExtra = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6,
    7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];
  static lenForLenMap = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];

  private bitSource: BitSource;
  private cache = new Uint8Array(Inflater.cacheSize);
  private cacheIdx = 0;

  constructor(buf: Uint8Array) {
    this.bitSource = new BitSource(buf);
  }

  private outByte(byte: number) {
    this.cache[this.cacheIdx] = byte;
    this.cacheIdx = (this.cacheIdx + 1) % Inflater.cacheSize;
  }

  private refCache(distance: number) {
    const idx = (this.cacheIdx - distance) % Inflater.cacheSize;
    return this.cache[idx];
  }

  private getByTree(tree: HuffmanTree): number {
    let cur = tree.root;
    while (cur.val === undefined) {
      const bit = this.bitSource.read(1) as (0 | 1);
      cur = cur[bit]!;
    }
    return cur.val;
  }

  private parseDynTree() {
    const hLit = this.bitSource.read(5) + 257;
    const hDist = this.bitSource.read(5) + 1;
    const hCodeLen = this.bitSource.read(4) + 4;
    const lenForLen = new Uint8Array(19);
    for (let i = 0; i < hCodeLen; i++) {
      lenForLen[Inflater.lenForLenMap[i]] = this.bitSource.read(3);
    }
    const lenTree = new HuffmanTree(lenForLen);
    const codeLens = new Uint8Array(hLit + hDist);
    let cnt = 0;
    while (cnt < codeLens.length) {
      const v = this.getByTree(lenTree);
      switch (v) {
        case 16:
          const repeatN = 3 + this.bitSource.read(2);
          const last = codeLens[cnt - 1];
          for (let i = 0; i < repeatN; i++) {
            codeLens[cnt++] = last;
          }
          break;

        case 17:
          const zeroN = 3 + this.bitSource.read(3);
          for (let i = 0; i < zeroN; i++) {
            codeLens[cnt++] = 0;
          }
          break;

        case 18:
          const moreZeroN = 11 + this.bitSource.read(7);
          for (let i = 0; i < moreZeroN; i++) {
            codeLens[cnt++] = 0;
          }
          break;

        default:
          if (v < 0 || v > 15) {
            throw Error("Code length not in [0, 18].");
          }
          codeLens[cnt++] = v;
      }
    }

    const dynTreeL = new HuffmanTree(codeLens.slice(0, hLit));
    const dynTreeD = new HuffmanTree(codeLens.slice(hLit));
    return {lTree: dynTreeL, dTree: dynTreeD};
  }

  private plainBlock() {
    this.bitSource.byteAlign();
    const len = this.bitSource.read(16);
    const nLen = this.bitSource.read(16);
    if ((len & nLen) !== 0) {
      throw Error(`Neg LEN check fails.`);
    }
    const buf = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      const byte = this.bitSource.read(8);
      buf[i] = byte;
      this.outByte(byte);
    }
    return buf;
  }

  private decodeBody(lTree: HuffmanTree, dTree: HuffmanTree) {
    const res: Array<number> = [];

    while (true) {
      const v = this.getByTree(lTree);
      if (v === 256) {
        break;
      } else if (v < 256) {
        res.push(v);
        this.outByte(v);
      } else {
        let n = Inflater.lengthExtra[v - 257];
        const extraLen = this.bitSource.read(n);
        const len = Inflater.lengthBase[v - 257] + extraLen;

        const distCode = this.getByTree(dTree);
        const dist_n = Inflater.distanceExtra[distCode];
        const extraDist = this.bitSource.read(dist_n);
        const dist = Inflater.distanceBase[distCode] + extraDist;

        for (let i = 0; i < len; i++) {
          const byte = this.refCache(dist);
          res.push(byte);
          this.outByte(byte);
        }
      }

    }
    const buf = new Uint8Array(res.length);
    buf.set(res);
    return buf;
  }

  private readBlock() {
    const lastBlock = this.bitSource.read(1);
    const blockType = this.bitSource.read(2);

    let value = new Uint8Array(0);

    switch (blockType) {
      case 0b00:
        value = this.plainBlock();
        break;

      case 0b01:
        value = this.decodeBody(Inflater.fixedLTree, Inflater.fixedDTree);
        break;

      case 0b10:
        const {lTree, dTree} = this.parseDynTree();
        value = this.decodeBody(lTree, dTree);
        break;

      case 0b11:
        throw Error("Error Alignment.");
    }

    return {done: lastBlock, value};
  }

  inflate(): Uint8Array {
    const blocks = [];

    while (true) {
      const {value, done} = this.readBlock();
      blocks.push(value as Uint8Array);
      if (done) break;
    }

    const len = blocks.reduce((acc, x) => {
      return acc + x.length;
    }, 0);

    const r = new Uint8Array(len);
    let idx = 0;
    for (const block of blocks) {
      r.set(block, idx);
      idx += block.length;
    }

    return r;
  }
}

function toHex(x: number, n: number = 2) {
  return '0X' + x.toString(16).toUpperCase().padStart(n, '0');
}

export {
  Inflater
};
