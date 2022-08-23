<script setup lang="ts">
import FocusLink from '../../widget/FocusLink/FocusLink.vue';
import FlexSpace from '../../widget/FlexSpace/FlexSpace.vue';
import ColorButton from '../../widget/ColorButton/ColorButton.vue';
import useUserStore from '../../store/userStore';
import Avatar from './Avatar/Avatar.vue';

const userStore = useUserStore();
const logged = $computed(() => !!userStore.userId);

</script>

<template>
  <header class="soundwhere-main-header">
    <div class="logo" @click="$router.push('/')">
      SOUNDWHERE
    </div>
    <nav>
      <FocusLink text="Datasets" target="/datasets" />
      <FocusLink text="Contribute" target="/contribute" />
      <FocusLink text="Classification" target="/classification"/>
    </nav>
    <FlexSpace />
    <ColorButton v-if="!logged" @click="$router.push('/login')">
      Login
    </ColorButton>
    <Avatar v-else :username="userStore.username" />
  </header>
</template>

<style lang="scss" src="./MainHeader.scss" scoped />
