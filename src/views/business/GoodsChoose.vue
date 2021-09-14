<template>
  <div class="body">
    <van-nav-bar
        title="商品选择"
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


    <van-tree-select
        v-model:active-id="activeIds"
        v-model:main-active-index="activeIndex"
        :items="goodsList"
    />


    <van-submit-bar
        :price="activeIds.length*100"
        button-text="确定"
        decimal-length=''
        label="已选："
        currency=""
        @submit="onSubmit"/>
  </div>
</template>

<script lang="ts">
import {onBeforeMount, reactive, ref, toRefs, watch} from 'vue'
import router from "../../router";
import http from '../../api/request'
import {useStore} from 'vuex'

export default {
  name: "GoodsChoose",
  setup() {
    const store = useStore()
    const activeIds = ref([]);
    const activeIndex = ref(0);
    let data = reactive({
      backupList: [],
      goodsList: [],
      selectedGoods: []
    })

    /*品类-类*/
    class classItem {
      text: String
      children: Array<Object>
      badge: number

      constructor(obj: any) {
        this.text = obj.clsName
        this.children = []
        this.badge = 0
        this.add(obj)
      }

      add(item: any): void {
        let that = this
        let res = that.children.find((cItem: any) => {
          return cItem.text === item.pluName
        })
        if (res === -1 || !res) {
          item.text = item.pluName,
              item.id = item.pluCode
          that.children.push(item)
        }
      }

      delete(item: any) {
        let that = this
        let index = that.children.find(function (cItem: any, index) {
          if (cItem.text === item.pluName)
            return index
        })

        if (index !== -1) {
          console.log('找到的 下标', index);
          that.children.splice(<number>index, 1)
        }


      }

    }

    class goodsItem {

    }

    function getGoods() {
      http.get('/goods/query', {}).then((res: any) => {
        data.backupList = res.list

        res.list.forEach((resItem: any) => {
          let clsItem: classItem | undefined = data.goodsList.find((localItem: any) => {
            return localItem.text === resItem.clsName
          })

          if (clsItem) {
            clsItem.add(resItem)
          } else {
            let cls = new classItem(resItem)
            data.goodsList.push(cls)
          }
        })
      })
    }

    onBeforeMount(() => {
      getGoods()
      store.commit('SET_SELECTED_GOODS', [])
    })

    watch(activeIds, (newVal) => {
      console.log(newVal);
      data.goodsList[activeIndex.value].badge = newVal.length
    })


    function onClickLeft() {
      router.go(-1)
    }

    function onClickRight() {
      router.push('/goods-choose')
    }

    function onSubmit() {
      data.selectedGoods = data.backupList.reduce((last: any, now: any) => {
        if (activeIds.value.includes(now.pluCode)) {
          last.push(now)
        }
        return last
      }, [])

      store.commit('SET_SELECTED_GOODS', data.selectedGoods)
      router.go(-1)

    }

    return {
      activeIndex,
      activeIds,
      onClickRight,
      onClickLeft,
      onSubmit,
      ...toRefs(data)
    };
  },
}
</script>

<style scoped>
.body {
  height: 100vh;
  padding-top: 46px;
}

/deep/ .van-tree-select {
  height: calc(100% - 96px) !important;
}
</style>
