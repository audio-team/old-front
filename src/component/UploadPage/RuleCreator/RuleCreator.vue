<script setup lang="ts">
import ColorButton from '../../../widget/ColorButton';
import FlexSpace from '../../../widget/FlexSpace';
import {BatchRule, MetaType} from './index';
import {reactive} from 'vue';
import EasyInput from '../../../widget/EasyInput/EasyInput.vue';

const emit = defineEmits<{
  (e: 'done', rule?: BatchRule): void
}>();

const form = reactive({
  labelRegex: '(\\d+)/(\\d+)/\\1-\\2.trans.txt',
  lineFormat: '([\\d-]+) (.+)',
  groupToAudio: '$FLR1/$FLR2/$LLF1.flac',
  metaType: 'TaskLabel' as MetaType,
  metaKey: 'ASR',
});

const submit = () => {
  emit('done', {
    labelRegex: form.labelRegex,
    lineFormat: form.lineFormat,
    groupToAudio: form.groupToAudio,
    metaType: form.metaType,
    metaKey: form.metaKey,
  });
};

const onCancel = () => {
  emit('done');
};
</script>

<template>
  <div class="soundwhere-rule-creator">
    <h1>New Batch Labeling Rule</h1>
    <EasyInput text="Label File Regex" v-model="form.labelRegex" />
    <EasyInput text="Label Line Format" v-model="form.lineFormat" />
    <EasyInput text="Group To Audio Path" v-model="form.groupToAudio" />
    <span>Meta Type</span>
    <input v-model="form.metaType">
    <span>Meta Key</span>
    <input v-model="form.metaKey">
    <div class="line">
      <FlexSpace />
      <ColorButton @click="onCancel">Cancel</ColorButton>
      <FlexSpace />
      <ColorButton @click="submit">Done</ColorButton>
      <FlexSpace />
    </div>
  </div>
</template>

<style lang="scss" src="./RuleCreator.scss" scoped />
