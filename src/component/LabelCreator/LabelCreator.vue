<script setup lang="ts">
import {reactive} from 'vue';
import SimpleSelect from '../../widget/SimpleSelect/SimpleSelect.vue';

const args = reactive({
  labelType: 'TaskLabel',
  labelKey: 'SourceCat',
  labelVal: ''
});

const typeOptions = [
  {value: 'TaskLabel', text: 'Task Label'},
  {value: 'Property', text: 'Property'},
  {value: 'Tag', text: 'Tag'},
];

const taskTypeOptions = [
  {value: 'SourceCat', text: 'Audio Source Classification'},
  {value: 'ASR', text: 'Auto Speech Recognition'},
];

const waitForKey = $computed(() => {
  if (args.labelKey) return true;
  if (args.labelType === 'Tag') return true;
  return false;
});

const finished = $computed(() => {
  if (args.labelType === '' || args.labelKey === '') return false;
  if (args.labelVal === '' && args.labelType !== 'Tag') return false;
  return true;
});

</script>

<template>
  <div class="soundwhere-label-creator">
    <SimpleSelect name="Meta Info Type" v-model="args.labelType" :options="typeOptions" />
    <SimpleSelect v-if=" args.labelType === 'TaskLabel' "
               name="Task Type" v-model="args.labelKey" :options="taskTypeOptions" />
    <div v-if="waitForKey" class="value-area">
      <label for="meta-value">Content</label>
      <textarea id="meta-value" />
    </div>

    <p class="hint" v-if="!finished">Fill more to finish the meta info entry.</p>
  </div>
</template>

<style lang="scss" src="./LabelCreator.scss" scoped />
