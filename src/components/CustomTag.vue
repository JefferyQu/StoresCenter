<!-----------------------------------------------------------------------------
- 功能说明：标签组件
- 版权说明：quJie  版权所有
- 创建：quJie 2021-09-28
- 修改：
------------------------------------------------------------------------------->
<template>
  <van-tag
    :closeable="closeable"
    :color="color"
    :plain="plain"
    :round="round"
    :style="setStyle"
    :text-color="textColor"
    class="tag"
    @close="onClose($event)"
  >
    {{ setValue }}
  </van-tag>
</template>

<script lang="ts">
import {computed} from "vue";

export default {
  name: "CustomTag",
  props: {
    value: {
      type: String || Number,
      default: '',
      required: false
    },
    size: {
      type: String,
      default: '18px',
      required: false
    },
    color: {
      type: String,
      default: '#3682E7',
      required: false
    },
    plain: {
      type: Boolean,
      default: true,
      required: false
    },
    round: {
      type: Boolean,
      default: true,
      required: false
    },
    textColor: {
      type: String,
      default: '',
      required: false
    },
    closeable: {
      type: Boolean,
      default: false,
      required: false
    },
    padding: {
      type: String,
      default: '10px',
      required: false
    }
  },
  emits: {
    onClose: null
  },
  setup(props: any, {emit}: any) {

    /* 设置标签样式 */
    const setStyle = computed(() => {
      return {
        'font-size': props.size,
        padding: props.padding
      }
    })

    /* 设置显示内容 */
    const setValue = computed(() => {
      let ch = 0;
      let en = 0
      for (let i = 0; i < props.value.length; i++) {
        if (props.value.charCodeAt(i) > 255) {
          ch++;
        } else {
          en++;
        }
        if (ch * 2 + en >= 16) {
          return props.value.slice(0, ch + en) + '...'
        }
      }
      return props.value
    })

    /* 关闭事件 */
    function onClose(a: any) {
      emit('onClose', a)
    }

    return {
      setStyle,
      setValue,
      onClose,
    }
  }
}

</script>

<style scoped>
.tag {
  white-space: nowrap;
  margin: 10px;
}
</style>
