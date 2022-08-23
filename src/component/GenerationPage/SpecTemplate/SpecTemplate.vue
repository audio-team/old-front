<script setup lang="ts">
import {GenSpecTemplate} from '../index';
import MiniButton from '../../../widget/MiniButton/MiniButton.vue';

const {template} = defineProps<{
  template: GenSpecTemplate
}>();

const emit = defineEmits<{
  (e: 'add', template: GenSpecTemplate): void
}>();

const addSpec = () => {
  emit('add', template);
};
</script>

<template>
  <section class="soundwhere-spec-template">
    <h2>
      {{ template.name }}
    </h2>
    <i>{{ template.desc ?? 'default description' }}</i>
    <MiniButton @click="addSpec">Add</MiniButton>
  </section>
</template>

<style lang="scss" src="./SpecTemplate.scss" scoped />
