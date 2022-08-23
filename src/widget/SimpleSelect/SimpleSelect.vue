<script setup lang="ts">
import {useVModel} from '@vueuse/core';

interface Option {
  text: string;
  value: string;
}

const props = defineProps<{
  name: string;
  options: Option[];
  labelInline?: boolean;
  modelValue: string;
}>();

const modelProxy = useVModel(props);
let folded = $ref(true);
let cursor = $ref<number | undefined>();
let inputRef = $ref<any>();
const initText = props.options.find(opt => opt.value === modelProxy.value)!.text;
let selected = $ref(initText);
const id = $computed(() => `simple-select-${props.name}`);

const select = (optionIndex: number) => {
  const option = props.options[optionIndex];
  modelProxy.value = option.value;
  selected = option.text;
};
const quickSelect = () => {
  if (cursor !== undefined) select(cursor);
  inputRef.blur();
};
const toFocus = () => {
  folded = false;
};
const toBlur = () => {
  folded = true;
};

</script>

<template>
  <div class="soundwhere-simple-select" :class="{'label-inline': labelInline ?? false}">
    <label :for="id">{{ name }}</label>
    <div class="wrapper">
      <input readonly :id="id" v-model="selected" ref="inputRef"
             @focus="toFocus" @blur="toBlur" @keyup.enter="quickSelect">
      <div v-show="!folded" class="dropdown" @mouseleave="cursor=undefined">
        <div v-for="(opt,index) in options" :key="opt.value"
             class="dropdown-item" :class="{'highlighted': index === cursor, 'current': opt.value === modelProxy }"
             @mouseenter="cursor=index"
             @mousedown="() => select(index)">
          {{ opt.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./SimpleSelect.scss" scoped />
