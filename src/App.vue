<script setup lang="ts">
import CornerMessage from './widget/CornerMessage/CornerMessage.vue';
import useFnStore from './store/fnStore';
import {onMounted} from 'vue';
import {MessageOption} from './widget/CornerMessage';

const messageLoc = {h: 'right', v: 'top'};
const messageRef = $ref<any>();
onMounted(() => {
  const fnStore = useFnStore();
  fnStore.message = (option: MessageOption) => {
    messageRef.message(option);
  };
});

</script>

<template>
  <router-view />
  <CornerMessage ref="messageRef" :location="messageLoc" />
</template>

<style lang="scss" src="./util/Global.scss" />
