<script setup lang="ts">
import {Icon} from '@vicons/utils';
import MusicNoteOutlined from '@vicons/material/MusicNoteOutlined';
import Menu from '../../../widget/Menu';
import useUserStore from '../../../store/userStore';
import Popover from '../../../widget/Popover';
import {useRouter} from 'vue-router';

defineProps<{
  username: string
}>();

const userStore = useUserStore();
const router = useRouter();

const logout = async () => {
  userStore.userId = undefined;
  userStore.username = undefined;
  await router.push('/');
};

const menuItems = [
  {
    text: 'My profile', action: () => {
      router.push('profile');
    },
  },
  {
    text: 'Notification', action: () => {
      router.push('notifications');
    }
  },
  {text: 'Log out', action: logout},
];

</script>

<template>
  <div class="soundwhere-avatar">
    <span>
      Welcome, <b>{{ username }}</b>
    </span>
    <Popover style="height: 32px">
      <Icon size="32" class="avatar">
        <MusicNoteOutlined />
      </Icon>
      <template #content>
        <Menu :items="menuItems" />
      </template>
    </Popover>
  </div>
</template>

<style lang="scss" src="./Avatar.scss" scoped />
