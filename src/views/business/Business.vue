<!--业务列表-->
<template>
  <div class="body">
    <div v-for="item in businessList"
         class="items"
         @click="onBusinessClick(item)"
         :key="item.code">{{ item.name }}
    </div>
  </div>
</template>

<script lang="ts">
import http from '../../api/request'
import {ref} from "vue";
import {useStore} from 'vuex'
import router from "../../router";
import {Dialog,Toast} from 'vant'

export default {
  name: "Business",
  setup() {
    const store = useStore()
    let businessList = ref([])
    businessList.value=store.state.app.selectedOrg.business

    function onBusinessClick(item: any) {
          router.push({path:`/bill-list/${item.code}/${item.name}`})
    }

    return {
      businessList,
      onBusinessClick
    }

  }
}
</script>

<style scoped>
.body{
}
.items {
  height: 70px;
  padding: 0 20px 0 20px;
  border-bottom: 1px solid #999999;
  line-height: 70px;
}
</style>
