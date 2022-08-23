<script setup lang="ts">
import {EntryNode} from '../../FileList/data';
import ArrowLeft from '@vicons/carbon/ArrowLeft';
import {Icon} from '@vicons/utils';

import AudioDetail from './AudioDetail/AudioDetail.vue';

interface Prop {
  node: EntryNode;
}

const emit = defineEmits<{
  (e: 'back'): void
}>();

const {node} = defineProps<Prop>();

const type = $computed(() => node.data!.type);
</script>

<template>
  <div class="soundwhere-node-detail">

    <div class="title">
      <h2> {{ type === 'text' ? 'Text Content' : 'Audio Detail' }} </h2>
      <Icon size="2rem" @click="() => emit('back')" style="cursor: pointer;">
        <ArrowLeft />
      </Icon>
    </div>

    <AudioDetail v-if="type === 'audio'" :node="node" />

  </div>
</template>

<style lang="scss" src="./NodeDetail.scss" scoped />
