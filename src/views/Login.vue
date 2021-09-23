<!--登录界面-->
<template>
  <div class="v1">
    <router-link to="/" style="padding-left: 20px">
      <van-icon name="wap-home" size="20"/>
      服务地址
    </router-link>
    <h1>门店中心</h1>
    <van-form>
      <van-field
          v-model="username"
          label="工号"
          placeholder="工号"
      />
      <van-field
          type="password"
          v-model="password"
          label="密码"
          placeholder="密码"
      />

      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit" @click="onLoginClick">登录</van-button>
        <br>
        <van-button round block type="warning" native-type="submit" @click="onRegisterClick">注册</van-button>
      </div>
    </van-form>

  </div>


</template>

<script lang="ts">
import {onBeforeMount, reactive, toRefs, watch} from "vue";
import {Toast, Dialog} from 'vant'
import http from "../api/request";

import {useStore} from 'vuex'
import router from "../router";

export default {
  name: "Login",
  setup() {
    const store = useStore()

    //////////////////////////////////// 生命周期 ////////////////////////////////////
    onBeforeMount(()=>{
      store.dispatch('loginOut')
    })

    // 用户类
    class User {
      username: string
      password: string

      //构造函数
      constructor(username: string, password: string) {
        this.username = username
        this.password = password
      }

      //自定义方法
      get() {
        return {username: this.username, password: this.password}
      }
    }

    const data = reactive({
      username: '',
      password: '',
    } as {
      username:string,
      password:string
    })




    /**
     * 功能描述：登录按钮点击事件
     */
    function onLoginClick() {
      if (!data.username){
        Dialog.alert({
          message: '请输入工号',
          theme: 'round-button',
        }).then(() => {
          // on close
        });
        return
      }
      if(!data.password){
        Dialog.alert({
          message: '请输入密码',
          theme: 'round-button',
        }).then(() => {
          // on close
        });
        return;
      }
      const userInfo = new User(data.username, data.password).get()
      store.dispatch('Login', userInfo).then(res => {
        router.push('/Main')
      })

    }

    /**
     * 功能描述：注册按钮点击事件
     */
    function onRegisterClick() {
      const userInfo = new User(data.username, data.password).get()
      http.post('/users/sign_up', userInfo).then((res: any) => {
        console.log('请求成功', res);
        Dialog.alert({
          message: res.msg,
          theme: 'round-button',
        }).then(() => {
          // on close
        });
      }).catch(err => {
        console.log(err);
      })
    }


    return {
      ...toRefs(data),
      onLoginClick,
      onRegisterClick,

    }
  }
}
</script>

<style scoped>
h1 {
  text-align: center;
}

.v1 {
  padding-top: 30%;
  height: 100%;
}

</style>
