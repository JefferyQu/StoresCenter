<!-----------------------------------------------------------------------------
- 功能说明：二级路由的入口组件
- 版权说明：quJie  版权所有
- 创建：quJie 2021-09-28
- 修改：
------------------------------------------------------------------------------->
<template>
  <div>
    <van-nav-bar
      :title="getActiveTab==0?'门店中心':getActiveTab==1?'业务':'我的'"
      fixed
    />

    <!--子路由-->
    <section class="content">
      <router-view class="router-view"></router-view>
    </section>


    <!--底部导航栏-->
    <van-tabbar v-model="getActiveTab" fixed>
      <van-tabbar-item
        v-for="item in tabBarItems"
        :to="item.route"
        :icon="item.icon">{{item.title}}</van-tabbar-item>
    </van-tabbar>

    <!--切换组织-弹出层-->
    <van-popup v-model:show="showOrgChoose" position="right" :style="{height:'100%', width: '100%' }">
      <OrganizationChoose @switchOrg="switchOrg" type="vendor"></OrganizationChoose>
    </van-popup>
  </div>
</template>

<script lang="ts">
import {useStore} from 'vuex'
import {ref, computed} from "vue";
import OrganizationChoose from "../../components/ChooseMenu.vue";
import {useRouter} from 'vue-router'

export default {
  name: "Home",
  components: {
    OrganizationChoose
  },
  setup() {
    const router = useRouter()
    const store = useStore()
    const activeTab = ref(0);
    const showOrgChoose = ref(false)
    // const selectedOrg = store.state.app.selectedOrg
    const tabBarItems = [
      {
        title: '首页',
        route: '/Main/Home',
        icon: 'home-o'
      },
      {
        title: '业务',
        route: '/Main/Business',
        icon: 'search'
      },
      {
        title: '我的',
        route: '/Main/Personal',
        icon: 'setting-o'
      },
    ]

    //////////////////////////////////// 生命周期 ////////////////////////////////////
    /*    onBeforeMount(() => {
          //未选择组织
          if (!selectedOrg.orgId) {
            showOrgChoose.value = true
          }

          activeTab.value = store.state.app.activeTab
        })

        onUnmounted(() => {
          store.commit('SET_ACTIVE_TAB', activeTab.value)
        })*/

    const getActiveTab = computed({
      get() {
        let activeIndex: number = 0
        tabBarItems.find((item, index) => {
          if (router.currentRoute.value.path.indexOf(item.route) !== -1) {
            activeIndex = index
            return item
          }
        })
        return activeIndex
      },
      set(value: number) {
        router.push(tabBarItems[value].route)
      }
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
      tabBarItems,
      getActiveTab
    }

  }
}
</script>

<style scoped>
.content {
  position: fixed;
  top: var(--van-nav-bar-height);
  bottom: var(--van-tabbar-height);
  width: 100%;
  z-index: 10;
}
</style>
