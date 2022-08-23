<script setup lang="ts">
import {AudioInfo, EntryNode} from '../../../FileList/data';
import LabelCreator from '../../../LabelCreator';
import MetaLine from './MetaLine';
import {onMounted, watch} from 'vue';
import audioType from 'audio-type';

const props = defineProps<{
  node: EntryNode
}>();

const detailInit = {
  duration: undefined,
  url: undefined,
  format: 'UNKNOWN'
};
let detail = $ref<AudioInfo>(detailInit);
let newLabelMode = $ref(false);
let playerRef = $ref<any>();


onMounted(() => {
  playerRef.onloadedmetadata = () => {
    detail!.duration = playerRef.duration.toFixed(2);
  };
  playerRef.src = detail.url;
});

const toggleMode = () => {
  newLabelMode = !newLabelMode;
};

watch(() => props.node, async (newVal) => {
  newLabelMode = false;
  URL.revokeObjectURL(detail.url!);
  detail = detailInit;

  if (!newVal) {
    return;
  }

  const entry = newVal.data!.entry;
  const data = await entry.focus();
  const blob = new Blob([data]);

  detail.format = audioType(data).toUpperCase();
  detail.url = URL.createObjectURL(blob);

  if (playerRef) playerRef.src = detail.url;
}, {immediate: true});

</script>

<template>
  <div v-if="!newLabelMode">
    <audio ref="playerRef" controls>
      <source src="src/asset/84-121123-0004.flac">
    </audio>

    <div class="entries">
      <div class="entry">
        <em>Filename</em>
        <span>{{ node.data.entryName }}</span>
      </div>
      <div class="entry">
        <em>Format</em>
        <span>{{ detail?.format }}</span>
      </div>
      <div class="entry">
        <em>Duration</em>
        <span>{{ detail?.duration ?? 0 }} s</span>
      </div>
    </div>

    <h3>Labels</h3>

    <div v-for="meta in node.data.metaInfo" :key="meta.metaKey">
      <MetaLine :meta="meta" />
    </div>
  </div>

  <LabelCreator v-else />

  <button @click="toggleMode">{{ newLabelMode ? 'Finish' : 'Add Label' }}</button>
</template>

<style lang="scss" src="./AudioDetail.scss" scoped />
