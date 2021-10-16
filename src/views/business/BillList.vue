<!-----------------------------------------------------------------------------
- 功能说明：单据列表组件
- 版权说明：quJie  版权所有
- 创建：quJie 2021-10-28
- 修改：
------------------------------------------------------------------------------->
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
        <van-col span="20">
          <div class="vendor-name">
            {{ isVendorBusiness ? '组织' : '供应商' }}：{{ isVendorBusiness ? item.orgName : item.vendorName }}
          </div>
          <div class="bill-code">单号：{{ item.billCode }}</div>
          <div class="maker">制单人：{{ item.maker }}</div>
        </van-col>
        <van-col span="4">
          <div class="status" :style="'color:'+STATUS_COLOR[item.status]">{{ statusFormat(item.status) }}</div>
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
        type="primary">
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
import {BUSINESS_TYPE, BILL_TYPE, STATUS_READABLE, STATUS_READABLE_VENDOR, ENTER_TYPE} from '../../common/enums'


export default {
  name: "OrderList",
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const name: string = route.params.name as string
    const code: BUSINESS_TYPE = route.params.code as BUSINESS_TYPE
    const isVendorBusiness: boolean = [
      BUSINESS_TYPE.要货处理,
      BUSINESS_TYPE.货品配送,
    ].includes(code);

    const createAble: boolean = [
      BUSINESS_TYPE.门店要货,
      BUSINESS_TYPE.货品配送
    ].includes(code);

    enum STATUS_COLOR {
      'cornflowerblue',
      'green',
      'orange',
      '#999999',
    }


    let list = ref([])
    let billType = ''
    let nextPath = ''

    //////////////////////////////////// 生命周期 ////////////////////////////////////
    onBeforeMount(() => {
      initData()
    })

    //////////////////////////////////// 自定义方法 ////////////////////////////////////

    /**
     * 功能描述：初始化数据
     */
    function initData() {
      switch (code) {
        case BUSINESS_TYPE.门店要货: {
          billType = BILL_TYPE.PURCHASE
          nextPath = '/purchase'
          break
        }
        case BUSINESS_TYPE.要货处理: {
          billType = BILL_TYPE.PURCHASE
          nextPath = '/purchaseHandle'
          break
        }
      }

      getList()
    }

    /**
     * 功能描述：获取单据列表
     */
    function getList() {
      let params = {
        billType: billType,
        orgId: isVendorBusiness ? '' : store.state.app.selectedOrg.orgId,
        vendorId: isVendorBusiness ? store.state.app.selectedOrg.orgId : ''
      }

      http.get('/bill/queryByType', params).then((res: any) => {
        list.value = res.list
      })
    }

    /**
     * 功能描述：状态格式化
     *
     * @param {number} status 单据状态
     * @return {string} 对应的可读化数据
     */
    function statusFormat(status: number) {
      if (isVendorBusiness) {
        return STATUS_READABLE_VENDOR[status]
      }
      return STATUS_READABLE[status]
    }

    //////////////////////////////////// 事件处理 ////////////////////////////////////

    /**
     * 功能描述：返回按钮点击事件
     */
    function onClickLeft() {
      router.go(-1)
    }

    /**
     * 功能描述：搜索按钮点击事件
     */
    const onClickRight = () => Toast('按钮');

    /**
     * 功能描述：创建按钮点击事件
     */
    function onCreateBtnClick() {
      router.push({
        path: nextPath,
        query: {type: ENTER_TYPE.NEW}
      })
    }

    /**
     * 功能描述：单据选中事件
     *
     * @param {string} code 单据号
     */
    function onBillClick(code: string) {
      console.log(code);
      router.push({
        path: nextPath,
        query: {type: ENTER_TYPE.QUERY, code: code}
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
      onBillClick,
      STATUS_COLOR

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
  position: fixed;
  top: var(--van-nav-bar-height);
  bottom: var(--van-button-large-height);
  width: 100%;
  font-size: 14px;
  overflow-y: scroll;
}

.items {
  padding: 10px 20px 10px 20px;
  position: relative;
  font-size: 14px;
  background-color: white;
  margin-top: 5px;
}

.items .bill-code {
  line-height: 28px;
  color: #999999;
}

.items .maker {
  color: #999999;
}


.items .status {
  float: right;
  margin-top: 40%;
}
</style>
