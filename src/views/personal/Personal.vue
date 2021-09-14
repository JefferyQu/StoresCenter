<template>
<div class="personal">
  <div class="top">
    <img src="../../assets/logo.png">
    <div class="username">{{userInfo.username}}</div>
    <div class="org-name">{{orgName}}</div>

  </div>

  <div class="center">
    <van-cell title="切换组织" icon="shop-o" to="/orgChoose/all" is-link>
    </van-cell>

<!--退出登录-->
    <van-button class="login-out" round block type="primary" native-type="submit" @click="onLoginOut">退出登录</van-button>

  </div>


</div>
</template>

<script>
import {useStore} from 'vuex'
import {reactive, toRefs} from "vue";
import router from "../../router";
import {Dialog} from 'vant'
export default {
name: "My",
  setup(){
  const store=useStore()
    let data=reactive({
      userInfo:{},
      orgName:''
    })
    data.userInfo=store.state.user.userInfo
    data.orgName=store.state.app.selectedOrg.orgName

    function onLoginOut(){
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

    return{
    ...toRefs(data),
      onLoginOut
    }

  }
}
</script>

<style scoped>
.top{
  height: 120px;
  padding: 20px;
  position: relative;
}
.top img{
  height: 80px;
  width: 80px;
  top: 100px;
  border-radius: 50%;
}
.username{
  position: absolute;
  left: 120px;
  top: 35px;
}
.org-name{
  position: absolute;
  top: 75px;
  left: 120px;
  color: orange;
}

/*下半区*/
.center{

}
.login-out{
  width: 90%;
  margin-left: 5%;
  margin-top: 20px;
}
</style>
