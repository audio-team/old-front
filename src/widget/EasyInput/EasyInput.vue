<script setup lang="ts">
import {useVModel} from '@vueuse/core';

const props = defineProps<{
  modelValue: string
  text: string
}>();

const modelProxy = useVModel(props);

</script>

<template>
  <div class="soundwhere-easy-input">
    <span>{{ text }}</span>
    <input v-model="modelProxy">
  </div>
</template>

<style lang="scss" src="./EasyInput.scss" scoped />
