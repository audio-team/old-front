<script setup lang="ts">
defineProps<{
  text: string,
  target: string,
}>();
</script>

<template>
  <div class="soundwhere-focus-link">
    <a :href="target">
      {{ text }}
    </a>
  </div>
</template>

<style lang="scss" src="./FocusLink.scss" scoped />
