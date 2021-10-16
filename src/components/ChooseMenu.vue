<!-----------------------------------------------------------------------------
- 功能说明：选择菜单组件
- 版权说明：quJie  版权所有
- 创建：quJie 2021-10-15
- 修改：
------------------------------------------------------------------------------->
<template>
  <div>
    <van-nav-bar
      :title="title"
      left-text="返回"
      left-arrow
      @click-left="onCancelClick"
      fixed
      style="background-color: rgb(54, 189, 237);">
    </van-nav-bar>
    <section class="content">

      <!--搜索框-->
      <van-search
        v-model="searchValue"
        shape="round"
        placeholder="请输入搜索关键词"
      />

      <!--列表-->
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell v-for="item in filteredList" :key="item.orgId"
                  :title="item.title"
                  @click="onItemClick(item)"
        />
      </van-list>
    </section>

  </div>
</template>

<script lang="ts">
import {onBeforeMount, reactive, ref, toRefs, computed} from 'vue'
import http from '../api/request'
import {useStore} from "vuex";
import {useRouter} from 'vue-router'

export default {
  name: "choiceMenus",
  props: {
    type: {
      type: String,
      default: '',
      required: true
    },
    orgType: {
      type: String,
      default: '',
      required: false
    },
    billType: {
      type: String,
      default: '',
      required: false
    }
  },
  setup(props: any, {emit}: any) {
    const store = useStore()
    const router = useRouter()
    const loading = ref(false);
    const finished = ref(false);
    const data = reactive({
      title: '组织',
      searchValue: '',
      list: [],
      overIndex: 10,
    })

    //////////////////////////////////// 生命周期 ////////////////////////////////////
    onBeforeMount(() => {
      getList()
    })

    function getList() {
      switch (props.type) {
        case 'orgChoose': {
          getOrgList()
          break
        }
        case 'billChoose': {
          getBillList()
        }
      }


    }

    /**
     * 功能描述：获取组织列表
     */
    function getOrgList() {
      http.get('/org/query', {orgType: props.orgType}).then((res: any) => {
        data.list = res.list.map((item: any) => {
          item.title = item.orgId + ' ' + item.orgName;
          return item
        })
      })
    }

    /**
     * 功能描述：获取单据列表
     */
    function getBillList() {
      http.get('/bill/queryByType', {billType: props.billType}).then((res: any) => {
        data.list = res.list.map((item: any) => {
          item.title = item.billCode;
          return item
        })
      })
    }


    /*加载列表*/
    const onLoad = () => {
      data.overIndex += 5
      if (data.list.length <= data.overIndex) {
        finished.value = true
      }
    };

    const filteredList = computed(() => {
      const list = data.list.filter((item: any) => {
        return item.title.indexOf(data.searchValue) !== -1
      })
      return list.slice(0, data.overIndex)
    })

    /**
     * 功能描述：组织项点击事件
     *
     * @param {object} item 选中的组织
     */
    function onItemClick(item: any) {
      console.log('已选中',item);
      emit('onChoose', item)
    }

    /**
     * 功能描述：返回按钮点击事件
     */
    function onCancelClick() {
      emit('onCancelClick')
    }


    return {
      filteredList,
      onLoad,
      loading,
      finished,
      onItemClick,
      onCancelClick,
      ...toRefs(data),
    }
  }
}
</script>

<style scoped>
.content {
  height: calc(100% - var(--van-nav-bar-height));
  margin-top: var(--van-nav-bar-height);
}
</style>
