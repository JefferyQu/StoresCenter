<!--展台-->
<template>
  <div>
    <van-nav-bar
        :title="activeTab==0?'门店中心':activeTab==1?'业务':'我的'"
        fixed
    />

    <!--子路由-->
    <router-view class="router-view"></router-view>

    <!--底部导航栏-->
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
import {onBeforeMount, ref, onUnmounted} from "vue";
import OrganizationChoose from "../../components/OrganizationChoose.vue";

export default {
  name: "Home",
  components: {
    OrganizationChoose
  },
  setup() {
    const store = useStore()
    const activeTab = ref(0);
    const showOrgChoose = ref(false)
    const selectedOrg = store.state.app.selectedOrg

    //////////////////////////////////// 生命周期 ////////////////////////////////////
    onBeforeMount(() => {
      //未选择组织
      if (!selectedOrg.orgId) {
        showOrgChoose.value = true
      }

      activeTab.value = store.state.app.activeTab
    })

    onUnmounted(() => {
      store.commit('SET_ACTIVE_TAB', activeTab.value)
    })


    /**
     * 功能描述：选择组织
     *
     * @param {object} org 选中的组织
     */
    function switchOrg(org: any) {
      console.log(org);
      store.commit('SET_ORGANIZATION', org)
      showOrgChoose.value = false
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
