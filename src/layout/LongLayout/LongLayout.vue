<script setup lang="ts">
import MainFooter from '../../component/MainFooter/MainFooter.vue';
import MainHeader from '../../component/MainHeader/MainHeader.vue';
</script>

<template>
  <div class="soundwhere-long-layout">
    <MainHeader />
    <main>
      <router-view />
    </main>
    <MainFooter />
  </div>
</template>

<style lang="scss" src="./LongLayout.scss" scoped />
