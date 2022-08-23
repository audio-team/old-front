<script setup lang="ts">
defineProps<{
  items: { text: string, action: () => void }[]
}>();
</script>

<template>
  <section class="soundwhere-menu">
    <div class="item" v-for="item in items" :key="item.text" @click="item.action">
      {{ item.text }}
    </div>
  </section>
</template>

<style lang="scss" src="./Menu.scss" scoped />
