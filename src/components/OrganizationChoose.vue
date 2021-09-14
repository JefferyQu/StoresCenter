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
import {ref} from 'vue'
import router from "../router";
import http from '../api/request'
import {useStore} from "vuex";
import {Toast} from 'vant';
import {useRoute} from 'vue-router'

export default {
  name: "OrganizationChoose",
  setup() {
    const store = useStore()
    const route = useRoute()

    const list = ref([]);
    const loading = ref(false);
    const finished = ref(false);
    const type = route.params.type


    const onLoad = () => {
      loading.value = true
      http.get('/org/query', {orgType: type}).then((res: any) => {
        list.value = list.value.concat(res.list)
        loading.value = false
      })
    };


    function onClick(item: any) {
      switch (type){
        case 'all':
          store.commit('SET_ORGANIZATION', item)
              break
        case 'vendor':
          store.commit('SET_VENDOR', item)


      }
      Toast('切换成功！')
      router.go(-1)
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
