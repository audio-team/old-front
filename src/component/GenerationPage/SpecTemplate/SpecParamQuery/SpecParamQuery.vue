<script setup lang="ts">
import {GenSpecParam} from '../../index';
import {useVModel} from '@vueuse/core';
import {watch} from 'vue';

const props = defineProps<{
  param: GenSpecParam
  modelValue: any
}>();

const modelProxy = useVModel(props);

watch(() => props.modelValue, (val) => {
  console.log(val);
});

</script>

<template>
  <div class="soundwhere-spec-param-query">
    <h4>{{ param.name }}</h4>
    <select v-if="param.type === 'Option'" v-model="modelProxy">
      <option v-for="option in param.extra" :value="option">{{ option }}</option>
    </select>
    <input v-if="param.type === 'Num'" v-model="modelProxy" type="number">
    <input v-if="param.type === 'Bool'" v-model="modelProxy" type="checkbox">
    <div v-if="param.type === 'List'" class="options">
      <div v-for="option in param.extra">
        <input v-model="modelProxy" type="checkbox" :id="`checkbox-${option}`" :value="option">
        <label :for="`checkbox-${option}`">{{ option }}</label>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./SpecParamQuery.scss" scoped />
