<script setup lang="ts">
import ColorButton from '../../widget/ColorButton/ColorButton.vue';
</script>

<template>
  <div class="soundwhere-datasets">
    <section class="generate-panel">
      <p>公开数据集</p>
      <p>在现有研究中公开并被广泛使用的数据集</p>
      <ColorButton>下载</ColorButton>
    </section>
    <section class="public-panel">
      <p>自定义数据集</p>
      <p>根据需求从音频仓库生成自定义数据集</p>
      <ColorButton @click="$router.push('/generation')">生成</ColorButton>
    </section>
    <section class="statistic">
      <p>平台当前收录音频 10 条</p>
      <p>累计时长 60 秒</p>
    </section>
  </div>
</template>

<style lang="scss" src="./Datasets.scss" scoped />
