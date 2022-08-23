<script setup lang="ts">
import {AudioMeta} from '../../../../FileList/data';

const props = defineProps<{
  meta: AudioMeta
}>();

const colorClass = $computed(() => {
  switch (props.meta.type) {
    case 'TaskLabel':
      return 'red';
    case 'Property':
      return 'green';
    case 'Tag':
      return 'blue';
  }
});

</script>

<template>
  <div class="soundwhere-meta-line" :class="colorClass">
    <span class="name">{{ meta.metaKey }}</span>
    <span v-if="meta.type !== 'Tag'" class="value">{{ meta.value }}</span>
  </div>
</template>

<style lang="scss" src="./MetaLine.scss" scoped />
