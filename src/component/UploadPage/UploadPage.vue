<script setup lang="ts">
import Uploader from '../../widget/Uploader';
import FileList from '../FileList';
import NodeDetail from './NodeDetail';
import RuleCreator, {BatchRule} from './RuleCreator';
import Modal from '../../widget/Modal';
import uploadAPI from '../../api/audio/uploadAPI';
import audioKeysAPI from '../../api/audio/audioKeysAPI';
import {EntryDetail, EntryNode} from '../FileList/data';
import {reactive} from 'vue';
import JsZip from 'jszip';
import SubmitBox from './SubmitBox/SubmitBox.vue';
import {UploadOption} from './SubmitBox';
import createAPI from '../../api/dataset/createAPI';

const submitRef = $ref<any>();
const listRef = $ref<any>();
const newRuleRef = $ref<any>();

const files: File[] = reactive([]);

const onFileReceived = (file: File) => {
  listRef.addFile(file);
  files.push(file);
};

const unselect = () => {
  listRef.selected = undefined;
};

const upIt = async (option?: UploadOption) => {
  const audioToUpload: EntryDetail[] = [];
  const root = listRef.roots[0];
  const collectAudio = (node: EntryNode) => {
    if (node.data?.type === 'audio') {
      audioToUpload.push(node.data);
    }
  };
  root.layeredIter(collectAudio);

  let datasetID: number | undefined;
  if (option) {
    const r = await createAPI.debugRun(option);
    datasetID = r.id;
  }

  const audios = audioToUpload.map(value => {
    return {
      id: value.entry.filename,
      customMeta: value.metaInfo!
    };
  });
  
  const {keys} = await audioKeysAPI.debugRun({
    audios,
    datasetID
  });

  const LIMIT = 20 * 1024 * 1024;
  const batch = [];
  let size = 0;
  let uploaded = 0;
  for (const audio of audioToUpload) {
    let newSize = size + audio.entry.originalSize;
    // Full or finish, then send a request
    if (newSize > LIMIT) {
      await zipAndSend(batch, keys);
      uploaded += batch.length;
      console.log(`Progress: ${uploaded} / ${audioToUpload.length}`);
      batch.splice(0, batch.length);
      size = 0;
    }
    size += audio.entry.originalSize;
    batch.push(audio);
  }
  await zipAndSend(batch, keys);
  uploaded += batch.length;
  console.log(`Progress: ${uploaded} / ${audioToUpload.length}`);
  console.log('FINISH');

  submitRef.done();
};

const zipAndSend = async (batch: EntryDetail[], keys: Record<string, number>) => {
  let zip = new JsZip();
  for (const entry of batch) {
    const data = await entry.entry.focus();
    const key = keys[entry.entry.filename]!;
    zip.file(`${key}`, data);
  }

  console.log('compress');
  const content: Blob = await zip.generateAsync({
    type: 'blob', compressionOptions: {
      level: 0
    }
  });
  console.log('compress END');

  const file = new File([content], 'untitled');

  let formData = new FormData();
  formData.append('file', file);
  await uploadAPI.debugRun(formData);
};

const decoder = new TextDecoder();

const applyRule = async (rule?: BatchRule) => {
  if (!rule) {
    newRuleRef.done();
    return;
  }
  for (const _root of listRef.roots) {
    const root = _root as EntryNode;
    const lineFormat = new RegExp(rule.lineFormat);

    const labelFiles: { node: EntryNode, matches: RegExpMatchArray }[] = [];

    root.layeredIter(node => {
      const name = node.data!.entry.filename;
      const nameMatches = name.match(rule.labelRegex);
      if (nameMatches) {
        labelFiles.push({node, matches: nameMatches});
      }
    });
    const generated = new Map<string, string>();
    for (const {node, matches} of labelFiles) {
      const data = await node.data!.entry.focus();
      const lines = decoder.decode(data).split('\n');

      for (const line of lines) {
        const lineMatches = line.match(lineFormat);
        if (!lineMatches) break;

        const varTable: Record<string, RegExpMatchArray> = {
          'FLR': matches,
          'LLF': lineMatches,
        };

        const lookup = (substring: string) => {
          const table = varTable[substring.substring(1, 4)];
          const idx = Number.parseInt(substring.substring(4));
          return table[idx];
        };

        const audioPath = rule.groupToAudio.replace(/\$(FLR|LLF)(\d+)/g, lookup);
        const value = '$LLF2'.replace(/\$(FLR|LLF)(\d+)/g, lookup);
        generated.set(audioPath, value);
      }
    }

    console.log(generated);
    const applyGenerated = (node: EntryNode) => {
      const filename = node.data!.entry.filename;
      const value = generated.get(filename);
      console.log(filename);
      console.log(value);
      if (!value) return;
      const meta = {
        type: rule.metaType,
        metaKey: rule.metaKey,
        value
      };
      node.data?.metaInfo?.push(meta);
    };
    root.layeredIter(applyGenerated);
    console.log('FINISHED');
  }
  newRuleRef.done();
};

</script>

<template>
  <div class="soundwhere-upload-page">
    <div class="file-list">
      <h2>File Uploaded</h2>
      <FileList ref="listRef" />
    </div>

    <div v-if=" listRef?.selected " class="detail">
      <NodeDetail :node="listRef.selected" @back="unselect" />
    </div>

    <div v-else class="global-info">
      <h2>Operation Panel</h2>
      <p>No audio selected yet.</p>

      <button @click="submitRef.show()">Upload</button>
      <Modal ref="submitRef">
        <SubmitBox @done="upIt" @cancel="submitRef.done()" />
      </Modal>

      <button @click="newRuleRef.show()">Add</button>
      <Modal ref="newRuleRef">
        <RuleCreator @done="applyRule" />
      </Modal>

    </div>

    <div class="uploader">
      <Uploader @fileReceived="onFileReceived" />
    </div>

  </div>
</template>

<style lang="scss" src="./UploadPage.scss" scoped />
