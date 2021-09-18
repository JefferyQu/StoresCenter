<template>
  <div>
    <van-nav-bar
        class="test"
        style="color: white !important;background-color: red !important;"
        :title="activeTab==0?'门店中心':activeTab==1?'业务':'我的'"
        fixed
    />
    <router-view v-slot="{ Component ,route}"  class="router-view">
      <transition :name="route.meta.transitionName">
        <component :is="Component"></component>
      </transition>
    </router-view>

    <van-tabbar v-model="activeTab" fixed>
      <van-tabbar-item to="/Main/Home" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/Main/Business" icon="search">业务</van-tabbar-item>
      <van-tabbar-item to="/Main/Personal" icon="setting-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script lang="ts">
import {useStore} from 'vuex'
import router from "../../router";
import TabBar from "../../components/TabBar.vue";
import {ref} from "vue";

export default {
  name: "Home",
  components: {
    TabBar
  },
  setup() {
    const store = useStore()
    const activeTab = ref(0);
    let selectedOrg = store.state.app.selectedOrg

    //未选择组织
    if (!selectedOrg.orgId) {
      router.push('/orgChoose/all')
    }


    return {
      activeTab
    }

  }
}
</script>

<style scoped>
.test{
  color: white !important;
  background-color: red;
}

::v-deep(.van-nav-bar__title){
  color: white !important;
  background-color: red;
}

.router-view {
  margin-top: 46px;
  height: calc(100% - 196px);
}
</style>
