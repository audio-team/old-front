<script setup lang="ts">
import LabeledInput from '../../widget/LabeledInput/LabeledInput.vue';
import FlexSpace from '../../widget/FlexSpace/FlexSpace.vue';
import ColorButton from '../../widget/ColorButton/ColorButton.vue';
import SideLink from '../../widget/SideLink/SideLink.vue';
import {reactive} from 'vue';
import User from '@vicons/carbon/User';
import Locked from '@vicons/carbon/Locked';
import loginAPI from '../../api/user/loginAPI';
import {useRouter} from 'vue-router';
import useUserStore from '../../store/userStore';

const userStore = useUserStore();

const form = reactive({
  username: '',
  password: '',
  rememberMe: false,
});

const router = useRouter();

const login = async () => {
  console.log(form);
  try {
    const info = await loginAPI.debugRun({
      'remember-me': form.rememberMe
    }, {
      username: form.username,
      password: form.password,
    });
    
    userStore.userId = info.id;
    userStore.username = info.username;
    
    await router.push('/');
  } catch (code) {
    console.error(code);
  }
};

</script>

<template>
  <section class="soundwhere-login-box">
    <h1 @click="$router.push('/')">Soundwhere</h1>

    <div class="init-line">
      <h3>Login</h3>
      <FlexSpace />
      <SideLink>No account yet?</SideLink>
    </div>

    <form>
      <LabeledInput placeholder="Username" v-model="form.username" @keyup.enter="login"
                    autocomplete="username">
        <template v-slot:icon>
          <User />
        </template>
      </LabeledInput>
      
      <LabeledInput placeholder="Password" v-model="form.password" @keyup.enter="login"
                    type="password" autocomplete="current-password">
        <template v-slot:icon>
          <Locked />
        </template>
      </LabeledInput>
    </form>

    <div class="tail-line">
      <input type="checkbox" id="rememberMe" v-model="form.rememberMe">
      <label for="rememberMe">Remember me</label>
      <FlexSpace />
      <SideLink>
        Forget password?
      </SideLink>
    </div>

    <ColorButton @click="login">Login</ColorButton>

    <!--    <span>Or login with</span>-->
    <!---->
    <!--    <div class="other-ways">-->
    <!--      <ColorButton>Wechat</ColorButton>-->
    <!--      <ColorButton>QQ</ColorButton>-->
    <!--      <ColorButton>Github</ColorButton>-->
    <!--    </div>-->

  </section>
</template>

<style lang="scss" src="./LoginBox.scss" scoped />
