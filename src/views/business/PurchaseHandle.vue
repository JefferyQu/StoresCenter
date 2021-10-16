<template>
  <div class="body">
    <div class="bar">
      <van-nav-bar
        title="要货处理"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
        fixed
      >
      </van-nav-bar>
    </div>
    <div class="content">
      <van-cell-group>
        <van-cell title="单号" :value="bill.billCode"/>
        <van-cell title="供应商" :value="bill.vendorName"/>
        <van-cell title="制单时间" :value="dateFormat(bill.createTime,'yyyy-mm-dd hh:mm:ss')"/>
        <van-cell title="制单人" :value="bill.maker"/>
        <van-cell title="组织" :value="bill.orgName"/>
        <van-cell title="备注" :value="bill.remark"/>
      </van-cell-group>
      <div style="padding: 10px 15px 10px 15px;">
        商品明细
        <span style="float: right">合计:{{ bill.goodsList.length }}</span>
      </div>
      <van-swipe-cell v-for="(item,index) in bill.goodsList">
        <van-card
          :num="item.num"
          :price="item.price"
          :desc="'编号：' + item.pluCode"
          :title="item.pluName"
          class="goods-card"
          thumb="https://img01.yzcdn.cn/vant/cat.jpeg"
        >
          <template #tags>
            <van-tag plain type="danger">规格：{{ item.size }}</van-tag>
            <van-tag plain type="danger" style="margin: 5px 5px">单位:{{ item.unit }}</van-tag>
          </template>
          <template #footer>
            <van-stepper theme="round" button-size="22" v-model="item.num" v-if="editable"/>
          </template>

        </van-card>

        <template #right>
          <van-button square text="删除"
                      type="danger"
                      @click="onDeleteClick(item,index)"
                      class="delete-button" style="height:100%" v-if="editable"/>
        </template>
      </van-swipe-cell>

    </div>
    <div class="bottom">
      <div class="bottom-left" v-if="!isCanceled">
        <van-button
          @click="onSubmitClick('通过')"
          class="submit-btn"
          type="danger"
          size="large">
          通过
        </van-button>
      </div>
      <div class="bottom-right" v-if="!isCanceled">
        <van-button
          @click="onSubmitClick('驳回')"
          class="submit-btn"
          type="primary"
          size="large">
          驳回
        </van-button>
      </div>
      <div class="bottom-down" v-if="isCanceled && isShow">
        <van-button
          class="submit-btn"
          type="primary"
          disabled
          size="large">
          已通过
        </van-button>
      </div>
      <div class="bottom-down" v-if="isCanceled && !isShow">
        <van-button
          class="submit-btn"
          type="primary"
          disabled
          size="large">
          已驳回
        </van-button>
      </div>

    </div>
  </div>

</template>

<script lang="ts">
import router from '../../router'
import http from '../../api/request'
import {onBeforeMount, reactive, ref, toRefs} from 'vue'
import {useRoute} from 'vue-router'
import {PURCHASE_BILL} from "../../common/classes";
import {dateFormat} from "../../common/format";
import {Dialog} from 'vant'
import {BILL_STATUS} from "../../common/enums";

export default {

  name: "purchaseCancel",
  setup() {
    const route = useRoute()
    const isCanceled = ref(false)
    const editable = ref(false)
    const isShow = ref(false)
    let data = reactive({
      bill: {}
    } as { bill: PURCHASE_BILL })
    //////////////////////////////////// 生命周期 ////////////////////////////////////
    onBeforeMount(() => {
      getDetail(route.query.code as string)
    })

    /**
     * 功能描述：获取单据详情
     * @param {string} code 单号
     */
    function getDetail(code: string) {
      http.get('/bill/queryByCode', {billCode: code}).then(function (res: any) {
        data.bill = res.detail
        if (res.detail.status == BILL_STATUS.PASSED || res.detail.status == BILL_STATUS.FAILED) {
          isCanceled.value = true
        } else {
          isCanceled.value = false
        }
        isShow.value = res.detail.status == BILL_STATUS.PASSED

      })
    }

    /**
     * 功能描述：页面返回
     */

    function onClickLeft() {
      router.go(-1)
    }

    /**
     * 功能描述：删除事件
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
     * 功能描述：提交按钮事件
     */

    function onSubmitClick(msg: string) {
      let params = JSON.parse(JSON.stringify(data.bill))
      params.goodsList = JSON.stringify(params.goodsList)
      params.status = msg === '通过' ? BILL_STATUS.PASSED : BILL_STATUS.FAILED
      Dialog.confirm({
        message: `是否确认${msg}?`,
      }).then(() => {
        http.post('/bill/save', params).then(function (res: any) {
          Dialog.alert({
            message: `${msg}成功`,
          }).then(() => {
            router.go(-1)
          })
        })
      })
    }


    return {
      onClickLeft,
      editable,
      isCanceled,
      ...toRefs(data),
      dateFormat,
      onDeleteClick,
      onSubmitClick,
      isShow
    }
  }
}
</script>

<style scoped>
.body {
  height: 100%;
}

.bar {
  height: 50px;
}

.content {
  height: calc(100% - 100px);
  overflow-y: scroll;
}

.bottom {
  position: fixed;
  bottom: 0px;
  width: 100%;
  display: flex;
  height: 50px;
}

.bottom-left {
  width: 50%;
}

.bottom-right {
  width: 50%;
}

.bottom-down {
  width: 100%;
}
</style>
