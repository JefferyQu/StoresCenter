<!-----------------------------------------------------------------------------
- 功能说明：“我的”界面组件
- 版权说明：quJie  版权所有
- 创建：quJie 2021-09-28
- 修改：
------------------------------------------------------------------------------->
<template>
  <div class="personal">
    <div class="top">
      <img src="../../assets/logo.png">
      <div class="username">{{ userInfo.username }}</div>
      <div class="org-name">{{ orgName }}</div>
    </div>

    <div class="center">
      <van-cell title="切换组织" icon="shop-o" :value="orgName" @click="showOrgChoose=true" is-link>
      </van-cell>

      <!--退出登录-->
      <van-button class="login-out" round block type="primary" native-type="submit" @click="onLoginOut">退出登录
      </van-button>

    </div>

    <!--切换组织-弹出层-->
    <van-popup v-model:show="showOrgChoose" position="right" :style="{height:'100%', width: '100%' }">
      <choose-menu
        @onChoose="switchOrg"
        type="orgChoose"
        org-type="all"
        @onCancelClick="showOrgChoose=false" />
    </van-popup>

  </div>
</template>

<script lang="ts">
import {useStore} from 'vuex'
import {reactive, ref, toRefs} from "vue";
import router from "../../router";
import {Dialog} from 'vant'

export default {
  name: "My",
  setup() {
    const store = useStore()
    const showOrgChoose = ref(false)
    let data = reactive({
      userInfo: store.state.user.userInfo
    })
    const orgName=ref(store.state.app.selectedOrg.orgName)

    /**
     * 功能描述：退出登录点击事件
     */
    function onLoginOut() {
      Dialog.confirm({
        message: '确认退出？',
      })
          .then(() => {
            router.push('/Login')
          })
          .catch(() => {
            // on cancel
          });

    }

    /**
     * 功能描述：切换供应商
     *
     * @param {object} org 选中的组织
     */
    function switchOrg(org: any) {
      store.commit('SET_ORGANIZATION', org)
      orgName.value = org.orgName
      showOrgChoose.value=false
    }

    return {
      ...toRefs(data),
      orgName,
      onLoginOut,
      showOrgChoose,
      switchOrg,

    }

  }
}
</script>

<style scoped>
.top {
  height: 120px;
  padding: 20px;
  position: relative;
}

.top img {
  height: 80px;
  width: 80px;
  top: 100px;
  border-radius: 50%;
}

.username {
  position: absolute;
  left: 120px;
  top: 35px;
}

.org-name {
  position: absolute;
  top: 75px;
  left: 120px;
  color: orange;
}

/*下半区*/
.center {

}

.login-out {
  width: 90%;
  margin-left: 5%;
  margin-top: 20px;
}
</style>
