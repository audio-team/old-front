<script lang="ts">
export default {inheritAttrs: false};
</script>

<script setup lang="ts">
import {Icon} from '@vicons/utils';
import {useVModel} from '@vueuse/core';

interface Prop {
  modelValue: string;
  placeholder: string;
  type?: 'text' | 'password';
}

const props = defineProps<Prop>();
const {type = 'text', placeholder} = $(props);

const modelProxy = useVModel(props);

</script>

<template>
  <div class="soundwhere-labeled-input">
    <Icon size="24">
      <slot name="icon"></slot>
    </Icon>
    <input
        v-bind="$attrs"
        v-model="modelProxy"
        :placeholder="placeholder"
        :type="type" />
  </div>
</template>

<style lang="scss" src="./LabeledInput.scss" scoped />
