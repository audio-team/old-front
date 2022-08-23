<script setup lang="ts">
import {MessageData} from '../index';
import {CSSProperties, ref} from 'vue';

const {message} = defineProps<{
  message: MessageData
}>();

const emit = defineEmits<{
  (e: 'timeout'): void
}>();

setTimeout(() => {
  emit('timeout');
}, 20000);

const customStyle = $computed<CSSProperties>(() => ({
  zIndex: message.zIndex
}));
const containerRef = ref();

</script>

<template>
  <div class="soundwhere-message-entry" ref="containerRef" :style="customStyle">
    {{ message.content }}
  </div>
</template>

<style lang="scss" src="./MessageEntry.scss" scoped />
