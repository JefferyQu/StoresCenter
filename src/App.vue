<template>
  <router-view v-slot="{ Component ,route}">
    <transition :name="route.meta.transitionName">
      <component :is="Component"></component>
    </transition>
  </router-view>
</template>

<script lang="ts">
import {useStore} from 'vuex'
import {ref, toRefs, watch, getCurrentInstance, reactive} from "vue";
import {useRouter, useRoute,} from 'vue-router'

export default {
  name: 'App',
  setup() {
    console.log('重载');
    const store = useStore()
    const localUserInfo = JSON.parse(<string>localStorage.getItem('userInfo'))
    const localOrgInfo = JSON.parse(<string>localStorage.getItem('selectedOrg'))
    if (localUserInfo && localUserInfo.username) {

      //用于自动登录
      // store.dispatch('Login',localUserInfo)
      store.commit('SET_USERINFO', localUserInfo)
    }
    if (localOrgInfo) {
      store.commit('SET_ORGANIZATION', localOrgInfo)
    }


    return {}

  },
  watch: {
    $route(to: any, from: any) {

      if (to.meta.level > from.meta.level) {
        to.meta.transitionName = "forward";
      } else {
        to.meta.transitionName = "back";
      }
    }
  }
}
</script>
<style scoped>
.app {
  height: 100vh;
  max-height: 100vh;
}

.back-enter-active,
.back-leave-active,
.forward-enter-active,
.forward-leave-active {
  height: 100%;
  width: 100%;
  will-change: transform;
  transition: all 300ms ease-out;
  position: absolute;
  top: 0;
  backface-visibility: hidden;
}

.forward-enter-from {
  opacity: 1;
  transform: translate3d(100%, 0, 0);
}

.forward-leave-to {
  opacity: 1;
  transform: translate3d(-100%, 0, 0);
}

.back-enter-from {
  opacity: 1;
  transform: translate3d(-100%, 0, 0);
}

.back-leave-to {
  opacity: 1;
  transform: translate3d(100%, 0, 0);
}


</style>
