<script setup lang="ts">

import ColorButton from '../../widget/ColorButton/ColorButton.vue';
import FlexSpace from '../../widget/FlexSpace/FlexSpace.vue';
import SpecTemplate from './SpecTemplate/SpecTemplate.vue';
import {GenSpec, GenSpecTemplate, TaskDetail} from './index';
import {reactive, watch} from 'vue';
import GenSpecEntry from './GenSpecEntry';
import {scaleTemplate, langTemplate, durationTemplate, hierarchyTemplate, qualityTemplate} from './templates';
import genAPI from '../../api/dataset/genAPI';
import SimpleSelect from '../../widget/SimpleSelect/SimpleSelect.vue';
import {TaskType} from '../../util/domain';

let taskDetails: TaskDetail[] = [
  {
    type: 'ASR', name: 'Auto Speech Recognition', specificTemplates: [langTemplate]
  },
  {
    type: 'SourceClassification', name: 'Source Classification', specificTemplates: [hierarchyTemplate]
  },
  {
    type: 'Keyword', name: 'Keyword Detection', specificTemplates: [langTemplate]
  },
];

let taskType = $ref<TaskType>('SourceClassification');
watch(() => taskType, () => specs.splice(0, specs.length));

const typeOptions = taskDetails.map(info => {
  return {text: info.name, value: info.type};
});

let taskDetail = $computed(() => taskDetails.find(opt => opt.type === taskType));
let genericTemplates: GenSpecTemplate[] = [scaleTemplate, qualityTemplate, durationTemplate];
let specificTemplates: GenSpecTemplate[] = $computed(() => taskDetail!.specificTemplates);

let showSpec = $ref(false);
let toggleHint = $computed(() => showSpec ? 'Show Template' : 'Selected Specifications');

let specs: GenSpec[] = reactive([]);

const addSpec = (template: GenSpecTemplate) => {
  const args = template.params.map(param => ({type: param.type, value: param.defaultVal}));
  const spec: GenSpec = {template, args};
  specs.push(spec);
};

const generate = async () => {
  const DTOs = specs.map(spec => spec.template.dto(spec));
  DTOs.forEach(dto => {
    console.log(dto);
  });
  await genAPI.debugRun({
    type: taskDetail!.type,
    specs: DTOs
  });
  console.log('ok');
};

const deleteSpec = (index: number) => specs.splice(index, 1);

</script>

<template>
  <div class="soundwhere-generation-page">
    <div class="toolbar">
      <SimpleSelect name="Task Type" v-model="taskType" :options="typeOptions" 
                    label-inline />
      <FlexSpace />
      <ColorButton @click="showSpec = !showSpec">{{ toggleHint }}</ColorButton>
      <ColorButton @click="generate">Generate</ColorButton>
    </div>

    <div v-if="showSpec" class="specs">
      <GenSpecEntry v-for="(spec, index) in specs" :spec="spec" :key="spec.template.name"
                    @delete="() => deleteSpec(index)" />
    </div>

    <div v-else class="templates">
      <SpecTemplate v-for="template in genericTemplates" :template="template" :key="template.name"
                    @add="addSpec" />
      <SpecTemplate v-for="template in specificTemplates" :template="template" :key="template.name"
                    @add="addSpec" />
    </div>
  </div>
</template>

<style lang="scss" src="./GenerationPage.scss" scoped />
