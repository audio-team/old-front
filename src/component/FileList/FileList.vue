<script setup lang="ts">
import FileItem from './FileItem.vue';
import {provide, reactive, toRaw} from 'vue';
import {FileIndexed, ZipLen} from '../../util/ZipLen';
import TreeNode from '../../util/TreeNode';
import {EntryDetail, EntryNode} from './data';
import {KEY_selectNode} from '../../util/InjectionKeys';

const roots: EntryNode[] = reactive([]);

const typeFromMIME = (mime: string) => {
  let fileType = 'unknown';
  if (mime.split('/')[0] === 'audio') {
    fileType = 'audio';
  }
  if (mime === 'application/x-tar') {
    fileType = 'tar';
  }
  if (mime === 'application/zip') {
    fileType = 'zip';
  }
  return fileType;
};

const getExt = (name: string) => name.split('.').pop();

const typeFromName = (name: string) => {
  const ext = getExt(name);
  switch (ext) {
    case 'flac':
    case 'wav':
      return 'audio';
    case 'txt':
    case 'TXT':
      return 'text';
    default:
      return 'unknown';
  }
};


const addFile = async (file: File) => {
  const fileType = typeFromMIME(file.type);
  switch (fileType) {
    case 'unknown':
      return;
    case 'zip':

      const zipLen = new ZipLen(new FileIndexed(file));
      await zipLen.load();
      const entries = [];
      for (let i = 0; i < zipLen.entryCount; i++) {
        const entry = await zipLen.entry();
        entries.push(entry);
      }

      const root = new TreeNode<EntryDetail>();
      root.data = {
        // @ts-ignore
        entry: {
          filename: file.name
        },
        entryName: file.name,
        type: 'zip'
      };
      for (const entry of entries) {
        const parts = entry.filename.split('/');
        const isDir = parts[parts.length - 1] === '';
        if (isDir) parts.pop();
        const name = parts.pop()!;
        const type = isDir ? 'dir' : typeFromName(name);

        root.add(entry.filename, {
          entry: entry,
          entryName: name,
          type,
          metaInfo: isDir ? undefined : []
        });
      }

      root.trim(data => {
        return data.type !== 'unknown';
      });

      root.sort((a, b) => {
        if (a.type !== b.type) return a.type > b.type ? 1 : -1;
        else if (a.entryName !== b.entryName) return a.entryName > b.entryName ? 1 : -1;
        return 0;
      });

      root.shrink((parentData, childData) => {
        const ready = childData?.type === 'dir';
        if (ready) {
          parentData.entryName += ` / ${childData.entryName}`;
        }
        return ready;
      });

      roots.push(root);
  }
};

let selected = $ref<EntryNode>();
const selectNode = (node: EntryNode) => {
  console.log(node.data?.entry?.filename);
  selected = node;
};
provide(KEY_selectNode, selectNode);

defineExpose({
  addFile,
  roots: toRaw(roots),
  selected: $$(selected),
});

</script>

<template>
  <div class="soundwhere-file-list">
    <div class="scroll">
      <FileItem v-for="root in roots" :key="root.data.entry.filename" :node="root" />
    </div>
    <div v-if="roots.length === 0">
      <p>No Audio/Dataset(s) loaded yet.</p>
      <p>Using the uploader box below.</p>
    </div>
  </div>
</template>

<style lang="scss" src="./FileList.scss" scoped />
