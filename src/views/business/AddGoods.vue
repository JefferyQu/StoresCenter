<template>
  <div class="body">
    <van-nav-bar
        title="新品上架"
        left-text="返回"
        right-text=""
        left-arrow
        @click-left="onClickLeft"
        fixed
    >
    </van-nav-bar>

    <div class="content">
      <van-form>
        <van-cell-group>
          <van-field
              v-model="plu.pluCode"
              label="商品条码"
              placeholder="如无商品条码系统自动生成"
          />
          <van-field
              v-model="plu.pluName"
              label="商品名称"
              placeholder="商品名称"
              :rules="[{ required: true, message: '请填写商品名称' }]"
          />

          <van-field name="uploader" label="商品图片">
            <template #input>
              <van-uploader
                v-model="imgFile"
                multiple :max-count="1"
                :before-read="beforeRead"
                :after-read="onUploadClick"
              />
            </template>
          </van-field>
        </van-cell-group>

        <!--类目-->
        <van-cell-group style="margin-top: 10px">
          <van-field
              v-model="plu.clsName"
              is-link
              readonly
              label="类目"
              placeholder="请选择商品类目"
              @click="showCategory = true"
          />
          <van-field
              v-model="plu.size"
              label="规格"
              placeholder="规格"
              :rules="[{ required: true, message: '请填写规格' }]"
          />
          <van-field
              v-model="plu.unit"
              label="单位"
              placeholder="单位"
              :rules="[{ required: true, message: '请填写单位' }]"
          />
          <van-cell title="库存数量">
            <template #right-icon>
              <van-stepper v-model="plu.inventory" theme="round" button-size="22"/>
            </template>
          </van-cell>
        </van-cell-group>

        <!--价格、库存-->
        <van-cell-group style="margin-top: 10px">
          <van-cell title="零售价">
            <template #right-icon>
              <van-stepper v-model="plu.price" theme="round" button-size="22"/>
            </template>
          </van-cell>
          <van-cell title="会员价" v-show="vipPriceAble">
            <template #right-icon>
              <van-stepper v-model="plu.vipPrice" theme="round" button-size="22"/>
            </template>
          </van-cell>
          <van-cell title="是否开启会员价">
            <template #right-icon>
              <van-switch v-model="vipPriceAble"/>
            </template>
          </van-cell>



        </van-cell-group>
      </van-form>

      <van-popup v-model:show="showCategory" round position="bottom">
      <van-cascader
          v-model="plu.clsId"
          title="请选择所属类目"
          :options="options"
          :field-names="fieldNames"
          @close="showCategory = false"
          @finish="onFinish"
      />
      </van-popup>

    </div>

    <van-submit-bar
        button-text="上架"
        decimal-length=''
        currency=""
        @submit="onSubmitClick">
      <template #default>
        <van-checkbox
            v-model="plu.publish"
            checked-color="#ee0a24"
            style="position: absolute;left: 20px"
        >上架后发布
        </van-checkbox>
      </template>
    </van-submit-bar>
  </div>
</template>

<script lang="ts">
import router from "../../router";
import {GOODS} from "../../common/classes";
import {onBeforeMount, reactive, ref, toRefs} from "vue";
import {useStore} from 'vuex'
import {ENTER_TYPE} from "../../common/enums";
import http from '../../api/request'
import {Dialog, Toast} from 'vant'
import axios from "axios";
export default {
  name: "AddGoods",
  setup() {
    const store=useStore()
    const data = reactive({
      plu: {},
      vipPriceAble: false,
      imgFile: [
/*        {
        url: 'https://img.yzcdn.cn/vant/leaf.jpg',
        status: 'uploading',
        message: '上传中...',}*/
        ],
      showCategory:false,
      options:[],
    } as {
      plu: GOODS,
      vipPriceAble: boolean,
      imgFile: any ,
      showCategory:boolean,
      options:any
    })
    let file=''
    const code = ref('');
    const fieldNames = {
      text: 'clsName',
      value: 'clsId',
      children: 'children',
    };


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
      data.plu = new GOODS
      data.plu.orgId=store.state.user.userInfo.orgId
      data.plu.orgName=store.state.user.userInfo.orgName
      console.log(store.state.user.userInfo);
      http.get('/category/query',{}).then((res:any)=>{
        data.options=res.list
      })
    }

    function getCategoryList(){

    }


    //////////////////////////////////// 事件处理 ////////////////////////////////////

    /**
     * 功能描述：返回按钮点击事件
     */
    function onClickLeft() {
      router.go(-1)
    }

    /**
     * 功能描述：文件读取完成前置事件
     */
    const beforeRead = (file:any) => {
      console.log(file.type);
      if (file.type !== 'image/jpeg' && file.type !=='image/png') {
        Toast('请上传 jpg/png 格式图片');
        return false;
      }
      return true;
    };

    /**
     * 功能描述：图片上传点击事件
     */
    function onUploadClick(file:any){
      const baseURL = localStorage.getItem('baseURL')
      let formData=new FormData()
      formData.append('file',file.file)
      console.log(formData);
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'//添加请求头
        }
      }
      data.imgFile[0].status='uploading'
      data.imgFile[0].message='上传中...'
      axios.post(baseURL+'/file/upload',formData,config).then((res:any)=>{
        if (res.data.code==='1'){
          data.imgFile[0].status='done'
          data.imgFile[0].message=res.data.msg
          data.plu.imgUrl=res.data.path
        }else {
          data.imgFile[0].status='failed'
          data.imgFile[0].message=res.data.msg
        }
      })




    }

    /**
     * 功能描述：商品品类选择完成事件
     */
    function onFinish({selectedOptions}:any){
      data.plu.clsName=selectedOptions.map((option:any) => option.clsName).join('/')
      data.plu.clsId=selectedOptions[1].clsId
      data.showCategory=false
    }

    /**
     * 功能描述：商品完整性验证
     */
    function checkGoods(Goods:GOODS){
      console.log(Goods);
      if (!Goods.pluName){
        return '未填写商品名称'
      }
      if (!Goods.imgUrl){
        return '未选择商品图片'
      }
      if (!Goods.clsId){
        return '未选择商品类目'
      }
      if (!Goods.size){
        return '未填写商品规格'
      }
      if (!Goods.unit){
        return '未填写商品单位'
      }
      if (Goods.price < Goods.vipPrice){
        return '商品零售价不得大于会员价'
      }

      return 'pass'
    }

    /**
     * 功能描述：提交按钮点击事件
     *
     */
    function onSubmitClick() {
      Dialog.alert({
        message: '确认上架？',
        theme: 'round-button',
      }).then(() => {
        const checkResult=checkGoods(data.plu)
        if (checkResult!=='pass'){
          Dialog.alert({
            message: checkResult,
            theme: 'round-button',
          })
          return
        }
        http.post('/goods/add',data.plu).then((res:any)=>{
          Dialog.alert({
            message: res.msg,
            theme: 'round-button',
          }).then(() => {
            router.go(-1)
          });
        }).catch((err)=>{
          Dialog.alert({
            message: err.msg,
            theme: 'round-button',
          }).then(() => {
          });
        })
      })
    }

    return {
      onClickLeft,
      onSubmitClick,
      ...toRefs(data),
      code,
      fieldNames,
      onFinish,
      onUploadClick,
      beforeRead


    }
  }
}
</script>

<style scoped>
.content {
  margin-top: 50px;
  padding-bottom: 50px;
}
</style>
