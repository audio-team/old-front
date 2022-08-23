<script setup lang="ts">
import {EntryNode} from '../data';
import Music from '@vicons/carbon/Music';
import TXT from '@vicons/carbon/TXT';
import {Icon} from '@vicons/utils';
import {inject} from 'vue';
import {KEY_selectNode} from '../../../util/InjectionKeys';

interface Prop {
  node: EntryNode;
}

const {node} = defineProps<Prop>();

const selectNode = inject(KEY_selectNode)!;

const selected = () => {
  selectNode(node);
};

</script>

<template>
  <div class="soundwhere-file-leaf" @click="selected">
    <Icon size="24">
      <Music v-if=" node.data.type === 'audio' " />
      <TXT v-if=" node.data.type === 'text' " />
    </Icon>
    <span>{{ node.data.entryName }}</span>
  </div>
</template>

<style lang="scss" src="./FileLeaf.scss" scoped />
