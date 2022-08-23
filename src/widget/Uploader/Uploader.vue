<script setup lang="ts">
import Music from '@vicons/carbon/Music';
import {Icon} from '@vicons/utils';

const emit = defineEmits<{
  (e: 'file-received', file: File): void
}>();

let enterCount = $ref(0);

const onDragEnter = (e: DragEvent) => {
  enterCount += 1;
};

const onDragLeave = (e: DragEvent) => {
  enterCount -= 1;
};

const onDrop = (e: DragEvent) => {
  enterCount -= 1;
  handleFiles(e.dataTransfer!.files);
};

const input = $ref<HTMLInputElement>();

const askForFile = (e: Event) => {
  input?.click();
};

const handleFiles = (files: FileList) => {
  for (const file of files) {
    emit('file-received', file);
  }
};

const onChange = (e: Event) => {
  let input = e.target as HTMLInputElement;
  handleFiles(input.files!);
};

</script>

<template>
  <div class="soundwhere-uploader"
       :class="{'highlight': enterCount !== 0}"
       @dragenter.prevent.stop="onDragEnter"
       @dragleave.prevent.stop="onDragLeave"
       @dragover.prevent.stop
       @drop.prevent.stop="onDrop">
    <input ref="input" type="file" multiple style="display: none" @change="onChange" @click.stop>
    <Icon size="64">
      <Music />
    </Icon>
    <span>
      Drag audio dataset here or
      <span class="trigger" @click.prevent.stop="askForFile">click here to upload</span>
      (in ZIP format)
    </span>
  </div>
</template>

<style lang="scss" src="./Uploader.scss" scoped />
