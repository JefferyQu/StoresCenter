<!-----------------------------------------------------------------------------
- 功能说明：门店要货组件
- 版权说明：quJie  版权所有
- 创建：quJie 2021-10-08
- 修改：
------------------------------------------------------------------------------->
<template>
  <div class="body">
    <van-nav-bar
        title="要货单"
        left-text="返回"
        :right-text="editable?'添加商品':''"
        left-arrow
        @click-left="onClickLeft"
        @click-right="onClickRight"
        fixed
    >
    </van-nav-bar>
    <div class="content">
      <van-cell-group>
        <van-cell title="单号" :value="bill.billCode" v-if="bill.billCode"/>
        <van-cell title="供应商" :value="bill.vendorName||'请选择'" :is-link="editable"
                  @click="editable?showOrgChoose=true:''"/>
        <van-cell title="制单时间" :value="dateFormat(bill.createTime,'yyyy-mm-dd hh:mm:ss')"/>
        <van-cell title="制单人" :value="bill.maker"/>
        <van-cell title="组织" :value="bill.orgName"/>
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

      <div style="padding: 10px 15px 10px 15px;" v-if="bill.goodsList && bill.goodsList.length">
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
              <van-stepper v-if="editable" theme="round" button-size="22" v-model="item.num"/>
            </template>

          </van-card>

          <template #right>
            <van-button
                v-if="editable"
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
        v-if="editable"
        @click="onSubmitClick()"
        class="submit-btn"
        type="primary"
        size="large">
      提交要货单
    </van-button>
    <van-button
        v-else
        @click="onRevokeClick"
        class="submit-btn"
        :type="isCommitted?'danger':'primary'"
        :disabled="!isCommitted"
        size="large">
      {{ statusTips }}<br/>{{ dateFormat(bill.handleTime, 'yyyy-mm-dd hh:mm:ss') }}
    </van-button>

    <!--添加商品-弹出层-->
    <van-popup
        v-model:show="showGoodsChoose"
        round
        position="bottom"
        :style="{ height: '90%' }"
    >
      <goods-choose @addGoods="addGoods"/>
    </van-popup>

    <!--切换组织-弹出层-->
    <van-popup v-model:show="showOrgChoose" position="right" :style="{height:'100%', width: '100%' }">
      <choose-menu
        @onChoose="switchOrg"
        type="orgChoose"
        org-type="vendor"
        @onCancelClick="showOrgChoose=false" />
    </van-popup>
  </div>


</template>

<script lang="ts">
import {useStore} from 'vuex'
import {onBeforeMount, reactive, ref, toRefs,} from "vue";
import router from "../../router";
import {BILL_STATUS, BILL_TYPE, ENTER_TYPE, STATUS_READABLE} from "../../common/enums";
import {dateFormat} from "../../common/format";
import {Dialog} from 'vant'
import {PURCHASE_BILL,GOODS} from '../../common/classes'
import http from '../../api/request'
import {useRoute} from 'vue-router'
import GoodsChoose from "../../components/GoodsChoose.vue";


export default {
  name: "Purchase",
  components: {GoodsChoose},
  setup() {
    const store = useStore()
    const route = useRoute()
    const selectedOrg = store.state.app.selectedOrg
    const selectedVendor = store.state.app.selectedVendor
    const userInfo = store.state.user.userInfo
    const selectedGoods = store.state.app.selectedGoods
    let editable = ref(false)
    let showGoodsChoose = ref(false)
    let showOrgChoose = ref(false)
    const isCommitted = ref(false)
    const statusTips = ref('')

    let data = reactive({
      bill: {}
    } as { bill: PURCHASE_BILL })

    //////////////////////////////////// 生命周期 ////////////////////////////////////
    onBeforeMount(() => {
      initPage()

    })
    // onBeforeUnmount(()=>{
    //   store.commit('SET_BILL',data.bill)
    // })
    //////////////////////////////////// 自定义方法 ////////////////////////////////////

    //////////////////////////////////// 自定义方法 ////////////////////////////////////

    /**
     * 功能描述：初始化单据
     */
    function initPage() {
      switch (route.query.type as unknown) {

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
      store.commit('SET_BILL', new PURCHASE_BILL())
      data.bill = store.state.app.bill
      data.bill.orgId = selectedOrg.orgId
      data.bill.orgName = selectedOrg.orgName
      data.bill.maker = userInfo.username
      data.bill.billType = BILL_TYPE.PURCHASE
      data.bill.createTime = new Date().getTime() + ''
      data.bill.status = BILL_STATUS.COMMITTED
    }

    /**
     * 功能描述：获取单据详情
     *
     * @param {string} code 单号
     */
    function getBillDetail(code: string) {
      http.get('/bill/queryByCode', {billCode: code}).then((res: any) => {
        data.bill = res.detail
        isCommitted.value = res.detail.status == BILL_STATUS.COMMITTED
        statusTips.value = isCommitted.value ? '撤销要货' : STATUS_READABLE[res.detail.status]
      })
    }

    /**
     * 功能描述：添加商品
     *
     * @param {object []} goods 商品列表
     */
    function addGoods(goods: GOODS[]) {
      data.bill.addGoods(goods)
      showGoodsChoose.value = false
    }

    /**
     * 功能描述：切换供应商
     *
     * @param {object} org 选中的组织
     */
    function switchOrg(org: any) {
      console.log(org);
      store.commit('SET_VENDOR', org)
      data.bill.vendorId = org.orgId
      data.bill.vendorName = org.orgName
      data.bill.goodsList = []
      showOrgChoose.value = false
    }

    /**
     * 功能描述：单据完整性验证
     *
     * @param {object} bill 单据
     * @return {string} 验证结果
     */
    function billCheck(bill: PURCHASE_BILL) {
      if (!bill.vendorId) {
        return '未选择供应商'
      }
      if (!bill.goodsList.length) {
        return '未添加商品'
      }
      return 'PASS'
    }

    /**
     * 功能描述：保存单据
     */
        function saveBill(status: BILL_STATUS) {
          let params = JSON.parse(JSON.stringify(data.bill))
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
    //////////////////////////////////// 事件处理 ////////////////////////////////////

    /**
     * 功能描述：返回按钮点击事件
     */
    function onClickLeft() {
      router.go(-1)
    }

    /**
     * 功能描述：添加商品按钮点击事件
     */
    function onClickRight() {
      if (!data.bill.vendorId){
        Dialog.alert({
          message: '未选择供应商',
          theme: 'round-button'
        })
        return
      }
      showGoodsChoose.value = true
    }

    /**
     * 功能描述：删除按钮点击事件
     *
     * @param {object} item 商品
     * @param {number} index 商品下标
     */
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

    /**
     * 功能描述：提交按钮点击事件
     */
    function onSubmitClick() {
      Dialog.confirm({
        message: '提交要货单？',
      }).then(() => {
        let checkResult = billCheck(data.bill)
        if (checkResult === 'PASS') {
          saveBill(BILL_STATUS.COMMITTED)
        } else {
          Dialog.alert({
            message: checkResult,
            theme: 'round-button',
          })
        }
      }).catch(() => {
      });
    }

    /**
     * 功能描述：撤销按钮点击事件
     */
    function onRevokeClick() {
      Dialog.confirm({
        message: '确认撤销要货单？',
      }).then(() => {
        saveBill(BILL_STATUS.UNDONE)
      })
          .catch(() => {
            // on cancel
          });
    }

    return {
      ...toRefs(data),
      editable,
      onClickLeft,
      onClickRight,
      onDeleteClick,
      dateFormat,
      onSubmitClick,
      showGoodsChoose,
      showOrgChoose,
      addGoods,
      switchOrg,
      onRevokeClick,
      isCommitted,
      statusTips,

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
