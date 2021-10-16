<!-----------------------------------------------------------------------------
- 功能说明：面板功能开关组件
- 版权说明：quJie  版权所有
- 创建：quJie 2021-09-28
- 修改：
------------------------------------------------------------------------------->
<template>
  <div class="body">
    <van-nav-bar
        title="面板展示模块"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
        @click-right="onClickRight"
        right-text="保存"
        fixed
        style="background-color: rgb(54, 189, 237)">
    </van-nav-bar>


    <van-cell-group>
      <van-cell
          v-for="item in list"
          :key="item.code"
          :title="item.name"
      >
        <van-switch v-model="item.display"/>
      </van-cell>
    </van-cell-group>

  </div>
</template>

<script>
import {useStore} from 'vuex'
import {ref} from "vue";
import router from "../../router";

export default {
  name: "PanelModuleChoose",
  setup() {
    const store = useStore()
    const panelModule = store.state.user.userInfo.panelModule
    const list = ref(JSON.parse(JSON.stringify(panelModule)))

    /**
     * 功能描述：返回按钮点击事件
     */
    function onClickLeft() {
      router.go(-1)
    }

    /**
     * 功能描述：保存按钮点击事件
     */
    function onClickRight() {
      store.commit('SET_USERINFO',{panelModule:list.value})
      store.dispatch('saveUserInfo')
        router.go(-1)
    }

    return {
      list,
      onClickLeft,
      onClickRight

    }
  }
}
</script>

<style scoped>
.body {
  padding-top: 46px;
}
</style>
