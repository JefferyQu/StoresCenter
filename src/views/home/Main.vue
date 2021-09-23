<!--展台-->
<template>
  <div>
    <van-nav-bar
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

    <!--切换组织-弹出层-->
    <van-popup v-model:show="showOrgChoose" position="right" :style="{height:'100%', width: '100%' }">
      <OrganizationChoose @switchOrg="switchOrg" type="vendor"></OrganizationChoose>
    </van-popup>
  </div>
</template>

<script lang="ts">
import {useStore} from 'vuex'
import {ref} from "vue";
import OrganizationChoose from "../../components/OrganizationChoose.vue";

export default {
  name: "Home",
  components: {
    OrganizationChoose
  },
  setup() {
    const store = useStore()
    const activeTab = ref(0);
    const showOrgChoose=ref(false)
    const selectedOrg = store.state.app.selectedOrg

    //未选择组织
    if (!selectedOrg.orgId) {
      showOrgChoose.value=true
    }

    /**
     * 功能描述：选择组织
     *
     * @param {object} org 选中的组织
     */
    function switchOrg(org:any){
      console.log(org);
      store.commit('SET_ORGANIZATION', org)
      showOrgChoose.value=false
    }

    return {
      activeTab,
      showOrgChoose,
      switchOrg,
    }

  }
}
</script>

<style scoped>
.router-view {
  margin-top: 46px;
  height: calc(100% - 196px);
}
</style>
