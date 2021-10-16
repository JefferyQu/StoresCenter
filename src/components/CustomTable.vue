<!-----------------------------------------------------------------------------
- 功能说明：列表组件
- 版权说明：quJie  版权所有
- 创建：quJie 2021-09-28
- 修改：
- 使用说明：

  Props
  参数              说明               类型                  默认值
  data          必传，列表数据         Array                  无
  cols          必传，列配置           Array                  无
  index         是否显示序号           Boolean                false
  oddColor      奇数行颜色            String                 #EFF1F4
  evenColor     偶数行颜色            String                 white
  color         文字颜色              String                 black

  cols参数详情
  参数              说明               类型                  默认值
  title          列标题               String                无
  field           必填，字段名           String                无
  width          列宽度               String                auto
  align          对齐方式              String                数字右对齐，其他左对齐
  color          列文本颜色            String                #333333
  titleColor     列标题颜色            String                #666666


------------------------------------------------------------------------------->
<template>
  <custom-panel :title="title">
    <div class="content">
      <table>
        <tr :style="setRowStyle(1)" class="row">
          <td
            v-if="index"
            :style="setIndexStyle()"
            class="col">
          </td>

          <td
            v-for="col in cols"
            :style="setColStyle(col,'',true)"
            class="col">
            {{ col.title }}
          </td>
        </tr>
        <tr
          v-for="(item,i) in data"
          :style="setRowStyle(i)"
          class="row">

          <td
            v-if="index"
            :style="setIndexStyle()"
            class="col">
            {{ i + 1 }}
          </td>

          <td
            v-for="col in cols"
            :style="setColStyle(col,item[col.field],false)"
            class="col">
            {{ item[col.field] }}
          </td>
        </tr>
      </table>
    </div>
  </custom-panel>
</template>

<script lang="ts" setup>
const name = 'CustomTable'

interface ListItem {
  [key: string]: string | number
}

interface ListColumn {
  title: string
  field: string
  width: string
  align: 'left' | 'center' | 'right' | string
  titleColor: string
  color: string
}

interface Props {
  data: ListItem[]
  cols: ListColumn[]
  title?: string
  index?: boolean
  oddColor?: string
  evenColor?: string
  color?: string
}


const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  cols: () => [],
  title: '',
  index: false,
  oddColor: '#EFF1F4',
  evenColor: '#FFFFFF',
  color: '#000000'
})

/* 设置行样式 */
function setRowStyle(index: number) {
  const style = {
    background: 'transparent',
    color: props.color
  }
  style.background = index % 2 ? props.oddColor : props.evenColor
  return style
}

/* 设置列样式 */
function setColStyle(col: any, value: string | number, isTitle: boolean) {
  return {
    'text-align': col.align || (typeof value === "number" ? 'right' : 'left'),
    width: col.width || 'auto',
    color: isTitle ? col.titleColor || '#666666' : col.color || '#333333'
  }
}

/* 设置序号样式 */
function setIndexStyle() {
  return {
    width: props.data.length.toString().length * 10 + 'px',
    'flex-grow': 0
  }
}
</script>

<style scoped>
.content {
  width: calc(100% + 10px);
  overflow-x: scroll;
  margin-left: -5px;
}

table {
  margin-top: 10px;
  padding: 0 10px;
  width: 100%;
  font-size: 14px;
  border-collapse: collapse;
  border: 1px solid #F1F3F8;
  table-layout: fixed;
  word-break: break-all;
}

.row {
  line-height: 40px;
  border: 0;
}

.col {
  padding: 0 16px;
}
</style>
