<script setup lang="ts">
import {ref} from 'vue';
import {onClickOutside} from '@vueuse/core';

let visible = $ref(false);
let popoverRef = ref<any>();

onClickOutside(popoverRef, () => {
  visible = false;
});

</script>

<template>
  <div class="soundwhere-popover" ref="popoverRef" @click="visible = true">
    <slot />
    <div v-if="visible" class="content">
      <slot name="content" />
    </div>
  </div>
</template>

<style lang="scss" src="./Popover.scss" scoped />
