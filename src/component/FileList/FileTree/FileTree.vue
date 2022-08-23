<script setup lang="ts">
import TreeNode from '../../../util/TreeNode';
import {EntryDetail} from '../data';
import Folder from '@vicons/carbon/Folder';
import {Icon} from '@vicons/utils';
import FileItem from '../FileItem.vue';

defineProps<{
  node: TreeNode<EntryDetail>,
}>();

const folded = $ref(true);
</script>

<template>
  <div v-if="node.data" class="soundwhere-file-tree">

    <div class="title" @click="folded = !folded">
      <Icon class="icon" size="24">
        <Folder />
      </Icon>
      <span>{{ node.data.entryName }}</span>
    </div>

    <div class="children" v-if="!folded">
      <FileItem v-for="root in node.children.values()" :node="root" />
    </div>

  </div>
</template>

<style lang="scss" src="./FileTree.scss" scoped />
