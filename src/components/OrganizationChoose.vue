<template>
  <div>
    <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
    >
      <van-cell v-for="item in list" :key="item.orgId"
                :title="item.orgId+' '+item.orgName"
                @click="onClick(item)"
      />
    </van-list>
  </div>
</template>

<script lang="ts">
import {onBeforeMount, ref} from 'vue'
import http from '../api/request'
import {useStore} from "vuex";
import {Toast} from 'vant';

export default {
  name: "OrganizationChoose",
  props: ['type'],
  setup(props: any,context:any) {
    const store = useStore()
    const list = ref([]);
    const loading = ref(false);
    const finished = ref(false);

    //////////////////////////////////// 生命周期 ////////////////////////////////////
    onBeforeMount(() => {

    })

    /*加载组织列表*/
    const onLoad = () => {
      if (loading.value) {
        http.get('/org/query', {orgType: props.type}).then((res: any) => {
          list.value = list.value.concat(res.list)
          setTimeout(() => {
            loading.value = false
          }, 500)
        })
      }

    };

    /**
     * 功能描述：组织项点击事件
     *
     * @param {object} item 选中的组织
     */
    function onClick(item: any) {
      Toast('切换成功！')
      context.emit('switchOrg',item)
    }

    return {
      list,
      onLoad,
      loading,
      finished,
      onClick
    }
  }
}
</script>

<style scoped>

</style>
