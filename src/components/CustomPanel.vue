<!-----------------------------------------------------------------------------
- 功能说明：面板组件
- 版权说明：quJie  版权所有
- 创建：quJie 2021-09-28
- 修改：
- 使用说明：

  Props
  参数                说明                          类型               默认值
  title           面板标题(可选)                    string             无
  color           文字颜色(可选)                    string             black
  background      面板背景颜色(可选)                 string             white
  loading         是否显示占位图(可选)                boolean            false


  Slots
  名称                说明
  default         面板显示内容
------------------------------------------------------------------------------->
<template>
  <van-cell-group
    :style="setStyle"
    class="panel">

    <!--占位图-->
    <van-skeleton v-if="loading" :row="3" round title/>

    <!--面板标题-->

    <header v-if="title && !loading" class="panel_header">{{ title }}</header>

    <!--面板内容-->
    <div v-if="!loading" class="panel_content">
      <slot></slot>
    </div>
  </van-cell-group>
</template>

<script>
import {computed} from "vue";

export default {
  name: "CustomPanel",
  props: {
    title: {
      type: String,
      default: '',
      required: false
    },
    color: {
      type: String,
      default: 'var(--hs-color-text)',
      required: false
    },
    background: {
      type: String,
      default: 'var(--hs-bg-function-panel)',
      required: false
    },
    round: {
      type: Boolean,
      default: true,
      required: false
    },
    loading: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  setup(props) {
    const setStyle = computed(() => {
      return {
        background: props.background,
        color: props.color,
        'border-radius': props.round ? 'var(--hs-border-radius-normal)' : '0'
      }
    })

    return {
      setStyle
    }
  }
}
</script>

<style scoped>
.panel {
  width: calc(100% - 52px);
  margin: 10px;
  padding: 16px;
  border: 0;
}

.panel_header {
  line-height: 28px;
  font-weight: bold;
  padding-bottom: 16px;
  font-size: var(--hs-font-size-text);
}
</style>
