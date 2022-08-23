<script setup lang="ts">
import MainHeader from '../../component/MainHeader/MainHeader.vue';
</script>

<template>
  <section class="soundwhere-main-layout">
    <MainHeader />
    <main>
      <router-view />
    </main>
  </section>
</template>

<style lang="scss" src="./MainLayout.scss" scoped />
