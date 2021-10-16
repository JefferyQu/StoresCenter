<!-----------------------------------------------------------------------------
- 功能说明：货品配送组件
- 版权说明：quJie  版权所有
- 创建：quJie 2021-09-28
- 修改：
------------------------------------------------------------------------------->
<template>
  <div class="body">
    <van-nav-bar
      title="配送发货"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      fixed
    >
    </van-nav-bar>
    <section class="section">
      <van-cell-group>
        <van-cell title="采购单" :value="bill.purchaseBillCode || '请选择'" is-link @click="showChooseMenu=true"/>
        <van-cell title="收货组织" :value="bill.orgName" v-if="bill.orgName"/>
        <van-cell title="制单时间" :value="dateFormat(bill.createTime,'yyyy-mm-dd hh:mm:ss')"/>
        <van-cell title="制单人" :value="bill.maker"/>
        <van-cell title="发货组织" :value="bill.vendorName"/>
        <van-field
          v-model="bill.remark"
          rows="2"
          autosize
          :readonly="!editable"
          label="备注"
          type="textarea"
          maxlength="50"
          placeholder="备注信息"
          show-word-limit
        />
      </van-cell-group>

      <!--合计-->
      <div style="padding: 10px 15px 10px 15px;" v-if="bill.goodsList && bill.goodsList.length">
        商品明细
        <span style="float: right">合计：{{ bill.goodsList.length }}</span>
      </div>

      <!--商品明细      -->
      <van-cell-group>
        <van-swipe-cell v-for="(item,index) in bill.goodsList">
          <van-card
            :num="item.num"
            :price="item.price"
            :desc="'编号：'+item.pluCode"
            :title="item.pluName"
            class="goods-card"
            :thumb="'/api/file/goodsImg?url=/' + item.imgUrl"
          >
            <template #tags>
              <van-tag plain type="danger">规格：{{ item.size }}</van-tag>
              <van-tag plain type="danger" style="margin: 5px 5px">单位：{{ item.unit }}</van-tag>
            </template>


          </van-card>
        </van-swipe-cell>

      </van-cell-group>


      <van-button
        v-if="editable"
        @click="onSubmitClick()"
        class="submit-btn"
        type="primary"
        size="large">
        提交要货单
      </van-button>
    </section>

    <!--切换组织-弹出层-->
    <van-popup v-model:show="showChooseMenu" position="right" :style="{height:'100%', width: '100%' }">
      <choose-menu
        @onChoose="onBillChoose"
        type="billChoose"
        :bill-type="BILL_TYPE.PURCHASE"
        @onCancelClick="showChooseMenu=false"/>
    </van-popup>
  </div>
</template>

<script lang="ts">
import {useRouter, useRoute} from 'vue-router'
import {useStore} from 'vuex'
import {DELIVERY_BILL, PURCHASE_BILL} from '../../common/classes'
import {onBeforeMount, ref} from "vue";
import http from "../../api/request";
import {BILL_STATUS, BILL_TYPE, ENTER_TYPE} from "../../common/enums";
import {dateFormat} from '../../common/format'
import {Dialog} from "_vant@3.2.5@vant";
import router from "../../router";

export default {
  name: "GoodsDelivery",
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const bill = ref({} as DELIVERY_BILL)
    const editable = ref(false as boolean)
    const showChooseMenu = ref(false as boolean)


    onBeforeMount(() => {
      initPage()
    })

    //////////////////////////////////// 自定义方法 ////////////////////////////////////

    /**
     * 功能描述：初始化单据
     */
    function initPage() {
      console.log(route.query.type);
      switch (route.query.type as string) {

        //新建
        case ENTER_TYPE.NEW: {
          editable.value = true
          initBill()
          break
        }

        //查询
        case ENTER_TYPE.QUERY: {
          getBillDetail(route.query.code as string)
          break
        }
      }
    }


    /**
     * 功能描述：初始化单据
     */
    function initBill() {
      bill.value = new DELIVERY_BILL()
      bill.value.vendorId = store.state.app.selectedOrg.orgId
      bill.value.vendorName = store.state.app.selectedOrg.orgName
      bill.value.maker = store.state.user.userInfo.username
      bill.value.billType = BILL_TYPE.DELIVERY
      bill.value.createTime = Date.now() + ''
      bill.value.status = BILL_STATUS.WAIT_ACCEPT
      editable.value = true
    }

    /**
     * 功能描述：获取单据详情
     * @param {string} code 单号
     */
    function getBillDetail(code: string) {
      http.get('/bill/queryByCode', {billCode: code}).then(function (res: any) {

      })
    }


    /**
     * 功能描述：返回按钮点击事件
     */
    function onClickLeft() {
      router.go(-1)
    }

    /**
     * 功能描述：要货单点击事件
     */
    function onBillChoose(item: DELIVERY_BILL) {
      showChooseMenu.value = false
      bill.value.orgId = item.orgId
      bill.value.orgName = item.orgName
      bill.value.purchaseBillCode = item.billCode
      bill.value.goodsList = item.goodsList
    }

    /**
     * 功能描述：单据完整性验证
     *
     * @param {object} bill 单据
     * @return {string} 验证结果
     */
    function billCheck(bill: PURCHASE_BILL) {
      if (!bill.orgId) {
        return '未选择采购单'
      }
      return 'PASS'
    }

    /**
     * 功能描述：保存单据
     */
    function saveBill(status: BILL_STATUS) {
      let params = JSON.parse(JSON.stringify(bill.value))
      params.goodsList = JSON.stringify(params.goodsList)
      params.status = status
      http.post('/bill/save', params).then((res: any) => {
        Dialog.alert({
          message: res.msg,
          theme: 'round-button',
        }).then(() => {
          router.go(-1)
        });
      })
    }

    /**
     * 功能描述：要货单点击事件
     */
    function onSubmitClick(){
      Dialog.confirm({
        message: '提交配送发货单？',
      }).then(() => {
        let checkResult = billCheck(bill.value)
        if (checkResult === 'PASS') {
          saveBill(BILL_STATUS.WAIT_ACCEPT)
        } else {
          Dialog.alert({
            message: checkResult,
            theme: 'round-button',
          })
        }
      })
    }


    return {
      bill,
      editable,
      onClickLeft,
      dateFormat,
      showChooseMenu,
      onBillChoose,
      BILL_TYPE,
      onSubmitClick

    }
  }
}
</script>

<style scoped>
.section {
  position: absolute;
  left: 0;
  right: 0;
  top: var(--van-nav-bar-height);
  bottom: var(--van-button-large-height);

}

</style>
