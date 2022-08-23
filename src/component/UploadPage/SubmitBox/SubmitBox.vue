<script setup lang="ts">
import {UploadOption} from './index';
import EasyInput from '../../../widget/EasyInput';
import ColorButton from '../../../widget/ColorButton';
import FlexSpace from '../../../widget/FlexSpace';
import {TaskType} from '../../../util/domain';
import SimpleSelect from '../../../widget/SimpleSelect/SimpleSelect.vue';
import {Icon} from '@vicons/utils';
import {AudiotrackSharp, ListFilled} from '@vicons/material';

const emit = defineEmits<{
  (e: 'done', option?: UploadOption): void
  (e: 'cancel'): void
}>();

const taskTypeOptions = [
  {text: 'Source Classification', value: 'SourceClassification'},
  {text: 'Automatic Speech Recognition', value: 'ASR'},
  {text: 'Speech Keyword Detection', value: 'Keyword'},
];

const isDataset = $ref(true);
const name = $ref('');
const taskType = $ref<TaskType>('SourceClassification');
const publicAvailable = $ref(true);

const upload = () => {
  if (isDataset) {
    const option = {
      name,
      publicAvailable,
      taskType,
    };
    emit('done', option);
  } else {
    emit('done');
  }
};

</script>

<template>
  <div class="soundwhere-submit-box">
    <div class="title">
      <h1>{{ isDataset ? 'Upload the dataset' : 'Upload separated audio entries' }}</h1>
      <Icon size="24" @click="isDataset = !isDataset">
        <ListFilled v-if="isDataset" />
        <AudiotrackSharp v-else />
      </Icon>
    </div>

    <template v-if="isDataset">
      <EasyInput text="Dataset Name" v-model="name" />
      <SimpleSelect name="Task Type" :options="taskTypeOptions" v-model="taskType" />
    </template>
    <div class="line">
      <FlexSpace />
      <ColorButton @click="emit('cancel')">Cancel</ColorButton>
      <FlexSpace />
      <ColorButton @click="upload">Done</ColorButton>
      <FlexSpace />
    </div>
  </div>
</template>

<style lang="scss" src="./SubmitBox.scss" scoped />
