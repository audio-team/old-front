<script setup lang="ts">
import {reactive} from 'vue';
import {MessageOption, MessageData} from './index';
import MessageEntry from './MessageEntry';

const {location} = defineProps<{
  location: { h: 'left' | 'right', v: 'top' | 'bottom' }
  id?: string
}>();

let zIndexCounter = 1000;
const message = (option: MessageOption) => {
  const zIndex = zIndexCounter++;
  const id = `corner-message-${zIndex}`;

  messageQueue.push({
    ...option,
    zIndex,
    id
  });
};

const messageQueue: MessageData[] = reactive([]);
const remove = () => {
  messageQueue.splice(0, 1);
};

defineExpose({
  message
});

</script>

<template>
  <div class="soundwhere-corner-message" :class="[location.h, location.v]">
    <MessageEntry v-for="msg in messageQueue" :key="msg.id" :message="msg" @timeout="remove" />
  </div>
</template>

<style lang="scss" src="./CornerMessage.scss" scoped />
