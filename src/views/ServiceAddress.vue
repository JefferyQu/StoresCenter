<!-----------------------------------------------------------------------------
- 功能说明：服务地址切换组件
- 版权说明：quJie  版权所有
- 创建：quJie 2021-09-28
- 修改：
------------------------------------------------------------------------------->
<template>
  <div class="service">
    <van-cell-group inset>
      <van-field v-model="baseUrl" label="服务地址" placeholder="请输入服务地址"/>
    </van-cell-group>
    <br>
    <van-button round block type="primary" native-type="submit" @click="onSubmit">下一步</van-button>


  </div>

</template>

<script lang="ts">
import {ref} from 'vue'
import router from "../router";
import http from '../api/request'

export default {
  name: "ServiceAddress",
  setup() {
    let baseUrl = ref('www.tiyanfu.vip:8088')

    /**
     * 功能描述：提交按钮点击事件
     */
    function onSubmit() {
      localStorage.setItem('baseURL', '')
      http.get(`http://${baseUrl.value}`, {}).then((res:any)=>{
        localStorage.setItem('baseURL', 'http://' + baseUrl.value)
        router.push('/Login')
      })

    }

    return {
      baseUrl,
      onSubmit
    }
  }
}
</script>

<style scoped>
.service {
  height: 100%;
  padding-top: 50%;
  background: gainsboro;
}
</style>
