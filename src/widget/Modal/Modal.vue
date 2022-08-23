<script setup lang="ts">
let visible = $ref(false);
let show = () => visible = true;
let done = () => visible = false;
defineExpose({
  show, done
});
</script>

<template>
  <div class="soundwhere-modal" v-if="visible">
    <section class="content">
      <slot />
    </section>
  </div>
</template>

<style lang="scss" src="./Modal.scss" scoped />
