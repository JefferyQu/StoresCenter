<template>
  <div class="body">
    <van-nav-bar
        :title="name"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
        @click-right="onClickRight"
        fixed
        style="background-color: rgb(54, 189, 237)">
      <template #right>
        <van-icon name="search" size="18"/>
      </template>
    </van-nav-bar>

    <!--单据列表-->
    <div class="center-area">
      <van-row
          v-for="item in list"
          @click="onBillClick(item.billCode)"
          :key="item.billCode"
          class="items">
        <van-col span="14">
          <div class="vendor-name">
            {{ isVendorBusiness ? '组织' : '供应商' }}：{{ isVendorBusiness ? item.orgName : item.vendorName }}
          </div>
          <div class="maker">制单人：{{ item.maker }}</div>
        </van-col>
        <van-col span="10">
          <div class="status">{{ statusFormat(item.status) }}</div>
        </van-col>
      </van-row>

      <!--列表为空时-->
      <van-sticky v-if="!list.length" offset-top="20vh" position="top" style="text-align: center">
        <van-icon class="" size="80" name="balance-list-o"/>
        <div style="font-size: 20px;margin-top: 30px">暂无单据</div>
      </van-sticky>
    </div>

    <!--底部按钮-->
    <van-button
        v-if="createAble"
        @click="onCreateBtnClick"
        size="large"
        class="btn-bottom"
        color="linear-gradient(to right, #ff6034, #ee0a24)">
      创建{{ name }}单
    </van-button>
  </div>
</template>

<script lang="ts">
import {useRoute, useRouter} from 'vue-router'
import {Toast} from 'vant'
import http from '../../api/request'
import {onBeforeMount, ref} from "vue";
import {useStore} from 'vuex'
import {BUSINESS_TYPE, STATUS_READABLE, STATUS_READABLE_VENDOR} from '../../common/enums'


export default {
  name: "OrderList",
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const name = route.params.name
    const code = route.params.code as BUSINESS_TYPE
    const isVendorBusiness = [
      BUSINESS_TYPE.要货处理,
      BUSINESS_TYPE.货品配送
    ].includes(code);

    const createAble = [
      BUSINESS_TYPE.门店要货,
      BUSINESS_TYPE.货品配送
    ].includes(code);
    const purchaseStatus = ['门店已提交', '供应商已接单', '供应商已拒绝', '门店已撤销']


    let list = ref([])
    let billType = ''
    let nextPath = ''

    function onClickLeft() {
      router.go(-1)
    }

    const onClickRight = () => Toast('按钮');

    onBeforeMount(() => {
      initData()
      getList()
    })

    /*初始化数据*/
    function initData() {
      switch (code) {
        case BUSINESS_TYPE.门店要货: {
          billType = '1012'
          nextPath = '/purchase'
          break
        }
        case BUSINESS_TYPE.要货处理: {
          billType = '1012'
          nextPath = '/purchaseHandle'
          break
        }

      }

    }

    /*获取列表*/
    function getList() {
      let params = {
        billType: billType,
        orgId: isVendorBusiness ? '' : store.state.app.selectedOrg.orgId,
        vendorId: isVendorBusiness ? store.state.app.selectedOrg.orgId : ''
      }

      console.log(params);

      http.get('/bill/queryByType', params).then((res: any) => {
        list.value = res.list
      })
    }

    /*状态格式化*/
    function statusFormat(status: number) {
      if (isVendorBusiness) {
        return STATUS_READABLE_VENDOR[status]
      }
      return STATUS_READABLE[status]
    }

    /*创建单据*/
    function onCreateBtnClick() {
      router.push(nextPath)
    }

    /*选中单据*/
    function onBillClick(code) {
      console.log(code);
      router.push({
        path: nextPath,
        query: {code: code}
      })
    }

    return {
      name,
      list,
      isVendorBusiness,
      createAble,
      onClickLeft,
      onClickRight,
      statusFormat,
      onCreateBtnClick,
      onBillClick

    }
  }
}
</script>

<style scoped>
.body {
  height: 100%;
  position: relative;
}

.btn-bottom {
  position: fixed;
  bottom: 0;
}

.center-area {
  padding-top: 46px;
  padding-bottom: 50px;
  font-size: 14px;
  overflow-y: scroll;
  height: calc(100% - 48px);
}

.items {
  height: 40px;
  padding: 20px;
  position: relative;
  border-bottom: 1px solid #999999;
}

.items .maker {
  margin-top: 10px;
}

.items .status {
  float: right;
  color: cornflowerblue;
  line-height: 40px;
}
</style>
