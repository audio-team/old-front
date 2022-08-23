<script setup lang="ts">
import FileLeaf from './FileLeaf';
import FileTree from './FileTree';
import TreeNode from '../../util/TreeNode';
import {EntryDetail} from './data';

defineProps<{
  node: TreeNode<EntryDetail>
}>();

</script>

<template>
  <FileLeaf v-if="['audio','text'].includes(node.data.type)" :node="node" />
  <FileTree v-if="['dir', 'zip'].includes(node.data.type)" :node="node" />
</template>

<style lang="scss" scoped>

</style>
