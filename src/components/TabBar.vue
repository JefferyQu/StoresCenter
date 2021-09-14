<template>
<div class="tab-bar">

</div>
</template>

<script>
import {ref} from 'vue'
export default {
name: "TabBar",
  setup() {
    const active = ref(0);
    return { active };
  },
}
</script>

<style scoped>
.tab-bar{
  /*position: fixed;*/
  /*bottom: 0px;*/
}
</style>
