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
import {Toast} from "_vant@3.2.2@vant";

export default {
  name: "PanelModuleChoose",
  setup() {
    const store = useStore()
    let panelModule = store.state.user.userInfo.panelModule
    const list = ref(JSON.parse(JSON.stringify(panelModule)))

    function onClickLeft() {
      router.go(-1)
    }

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
