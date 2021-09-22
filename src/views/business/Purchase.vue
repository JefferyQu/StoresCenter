<!--门店要货界面-->
<template>
  <div class="body">
    <van-nav-bar
        title="要货单"
        left-text="返回"
        right-text="添加商品"
        left-arrow
        @click-left="onClickLeft"
        @click-right="onClickRight"

        fixed
        style="background-color: rgb(54, 189, 237)">
    </van-nav-bar>
    <div class="content">
      <van-cell-group>
        <van-cell title="单号" :value="bill.billCode" v-if="bill.billCode"/>
        <van-cell title="供应商" :value="bill.vendorName||'请选择'" is-link to="/orgChoose/vendor"/>
        <van-cell title="制单时间" :value="dateFormat(bill.createTime,'yyyy-mm-dd hh:mm:ss')"/>
        <van-cell title="制单人" :value="bill.maker"/>
        <van-cell title="组织" :value="bill.orgName"/>
        <van-field
            v-model="bill.remark"
            rows="2"
            autosize
            label="备注"
            type="textarea"
            maxlength="50"
            placeholder="备注信息"
            show-word-limit
        />
      </van-cell-group>

      <div style="padding: 10px 15px 10px 15px;" v-if="bill.goodsList.length">
        商品明细
        <span style="float: right">合计：{{ bill.goodsList.length }}</span>
      </div>

      <van-cell-group>
        <van-swipe-cell v-for="(item,index) in bill.goodsList">
          <van-card
              :num="item.num"
              :price="item.price"
              :desc="'编号：'+item.pluCode"
              :title="item.pluName"
              class="goods-card"
              thumb="https://img.yzcdn.cn/vant/cat.jpeg"
          >
            <template #tags>
              <van-tag plain type="danger">规格：{{ item.size }}</van-tag>
              <van-tag plain type="danger" style="margin: 5px 5px">单位：{{ item.unit }}</van-tag>
            </template>
            <template #footer>
              <van-stepper theme="round" button-size="22" v-model="item.num"/>
            </template>

          </van-card>

          <template #right>
            <van-button
                @click="onDeleteClick(item,index)"
                square
                text="删除"
                type="danger"
                class="delete-button"
                style="height: 100%"/>
          </template>
        </van-swipe-cell>

      </van-cell-group>

    </div>

    <van-button
        @click="onSubmitClick"
        class="submit-btn"
        type="primary"
        size="large">提交要货单
    </van-button>
  </div>
</template>

<script lang="ts">
import {useStore} from 'vuex'
import {reactive, toRefs, onBeforeMount, onBeforeUnmount,} from "vue";
import router from "../../router";
import {BILL_TYPE,BILL_STATUS} from "../../common/enums";
import {dateFormat} from "../../common/format";
import {Dialog, Toast} from 'vant'
import {PURCHASE_BILL} from '../../common/classes'
import http from '../../api/request'
import {useRoute} from 'vue-router'


export default {
  name: "Purchase",
  setup() {
    const store = useStore()
    const route = useRoute()
    const selectedOrg = store.state.app.selectedOrg
    const selectedVendor = store.state.app.selectedVendor
    const userInfo = store.state.user.userInfo
    const selectedGoods = store.state.app.selectedGoods
    const nowDate=new Date().getTime()

    let data = reactive({
      bill: {}
    } as { bill: PURCHASE_BILL })


    function onClickLeft() {
      router.go(-1)
    }

    function onClickRight() {
      router.push('/goods-choose')
    }

    /*获取单据详情*/
    function getBillDetail(code: string) {
      http.get('/bill/queryByCode', {billCode: code}).then((res: any) => {
        data.bill = res.detail
      })
    }

    /*初始化订单*/
    function initBill() {

      //查询单据
      if (route.query.code) {
        getBillDetail(route.query.code as string)
        return
      }

      if (!store.state.app.bill.billType) {
        store.commit('SET_BILL', new PURCHASE_BILL())
      }

      data.bill = store.state.app.bill
      data.bill.vendorId = selectedVendor.orgId
      data.bill.vendorName = selectedVendor.orgName
      data.bill.orgId = selectedOrg.orgId
      data.bill.orgName = selectedOrg.orgName
      data.bill.maker = userInfo.username
      data.bill.billType = BILL_TYPE.PURCHASE
      data.bill.maker = userInfo.username
      data.bill.createTime = nowDate.toString()
      data.bill.status = BILL_STATUS.COMMITTED

      selectedGoods.forEach((sItem: any) => {
        let res = data.bill.goodsList.find((item: any) => {
          return sItem.pluCode === item.pluCode
        })

        if (!res || res === -1) {
          sItem.num = 0
          data.bill.goodsList.push(sItem)
        }
      })
    }


    function onDeleteClick(item: any, index: number) {
      Dialog.confirm({
        message: `确认删除 ${item.pluName}?`,
      }).then(() => {
        data.bill.goodsList.splice(index, 1)
      })
          .catch(() => {
            // on cancel
          });
    }

    onBeforeMount(() => {
      initBill()

    })

    function onSubmitClick() {

      let params = JSON.parse(JSON.stringify(data.bill))

      params.goodsList = JSON.stringify(params.goodsList)
      http.post('/bill/save', params).then((res: any) => {
        Dialog.alert({
          message: res.msg,
          theme: 'round-button',
        }).then(() => {
          router.go(-1)
        });
      })
    }

    // onBeforeUnmount(()=>{
    //   store.commit('SET_BILL',data.bill)
    // })

    return {
      ...toRefs(data),
      onClickLeft,
      onClickRight,
      onDeleteClick,
      dateFormat,
      onSubmitClick
    }
  }


}
</script>

<style scoped>
.body {
  height: 100%;
}

.content {
  padding-top: 50px;
  font-size: 14px;
  height: calc(100% - 100px);
  overflow-y: scroll;
}

.submit-btn {
  position: fixed;
  bottom: 0;
}
</style>
