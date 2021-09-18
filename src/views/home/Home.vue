<template>
  <div class="body">
    <van-notice-bar
        left-icon="volume-o"
        text="在代码阅读过程中人们说脏话的频率是衡量代码质量的唯一标准。"
    />

    <div class="center-area">
      <div class="panel">
        <van-row>
          <van-col span="20">
            本周概况
            <van-icon :name="showPanelData?'eye-o':'closed-eye'" @click="showPanelData=!showPanelData"/>

          </van-col>
          <van-col span="4" style="font-size: 12px">
            <router-link to="/panel-module" tag="span" style="color: white">
              编辑
              <van-icon name="edit" />
            </router-link>

          </van-col>
        </van-row>


        <van-grid
            :border="false"
            :column-num="2">
          <van-grid-item v-for="item in userInfo.panelModule" v-show="item.display">
          <div class="panel-title">{{item.name}}</div>
            <div class="panel-num">{{showPanelData?'0.00':'****'}}</div>
          </van-grid-item>
        </van-grid>

      </div>


    </div>

  </div>
</template>

<script lang="ts">
import {onBeforeMount, reactive, toRefs} from "vue";
import {useStore} from 'vuex'
import http from '../../api/request'
export default {
  name: "Home",
  setup() {

    class userInfo{
      username:String
      panelModule:Object []

      constructor() {
        this.username=''
        this.panelModule=[]
      }

    }

    const store=useStore()
    let data = reactive({
      showPanelData: true,
      userInfo:userInfo

    })



    onBeforeMount(()=>{
      data.userInfo=store.state.user.userInfo
    })

    function savePanelModule(){
      let params={
        username:data.userInfo.username,
        panelModule:data.userInfo.panelModule
      }
      http.post('/users/savePanelModule',params).then((res:any)=>{
        console.log(res);
      })
    }

    function onEditClick(){

    }

    return {
      ...toRefs(data)
    }
  }
}
</script>

<style scoped>

.notice-swipe {
  height: 40px;
  line-height: 40px;
}

.center-area {
  padding: 10px;
}

.panel {
  background-color: rgb(54, 189, 237);
  border-radius: 0.5em;
  color: white;
  padding: 10px;
}

.panel-row {
  font-size: 12px;
  margin-top: 10px;
}

.panel-row .van-col {
  line-height: 30px;
}

.panel-num {
  font-size: 18px;
}

 ::v-deep(.van-grid-item__content){
  background-color: transparent !important;
  justify-content: space-between;
  padding: 8px;
  height: 60px;
}
::v-deep(.van-grid-item__content--center){
  align-items: flex-start;
}

.panel-title{
  font-size: 12px;
}
.panel-num{
  font-size: 18px;
  font-weight: bold;
}
</style>
