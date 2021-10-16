<!-----------------------------------------------------------------------------
- 功能说明：简单列表组件
- 版权说明：quJie  版权所有
- 创建：quJie 2021-10-03
- 修改：
- 使用说明：

  props
  参数                说明                          类型               默认值
  data               数据源                         any[]             []
  cols               显示列配置                      string[]          []
  title              标题                           string            ''
  total              列表项总数                      number            0
  max                最大显示行数                    number            5

  events
  名称                说明                          参数
  more               更多点击事件                    无
  item               列表项点击事件                  item 列表项数据
------------------------------------------------------------------------------->

<template>
  <base-panel-component class="simple-list-component">

    <!-- 标题 -->
    <header class="header item-padding">
      <section class="header__title">{{ title || '' }}</section>
      <van-badge
        v-if="total"
        :content="total"
        class="header__badge"/>
      <section
        v-if="isShowMoreButton()"
        class="header__btn-more"
        @click="emits('more')">
        更多
      </section>
    </header>

    <!-- 列表列表 -->
    <van-list class="list-wrap">
      <template v-for="(item, itemIndex) in data">
        <van-cell
          v-if="isShowListItem(itemIndex)"
          class="list__item item-padding"
          @click="emits('item', item)">
          <template v-for="(col, colIndex) in cols" :key="col">
            <section
              v-if="colIndex < 2"
              :class="`col__${colIndex + 1}`"
              class="item__col"> <!-- 暂时只支持显示两列 -->
              {{ item[col] }}
            </section>
          </template>
        </van-cell>
      </template>
    </van-list>
  </base-panel-component>
</template>

<script lang="ts" setup>

const name = 'CustomList'

interface ListItem {
  [key: string]: string | number
}

interface Props {
  data: ListItem[]
  cols: string[]
  title: string
  total?: number
  max?: number
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  cols: () => [],
  total: 0,
  max: 5
})

const emits = defineEmits<{
  (e: 'more'): void
  (e: 'item', item: any): void
}>();

function isShowMoreButton() {
  return props.data.length > props.max
}

function isShowListItem(index: number) {
  return index < props.max
}

</script>

<style scoped>
.simple-list-component {
  padding: 0 !important;
  width: calc(100% - 20px) !important;
}

.item-padding {
  padding: 0 20px;
}

.header {
  display: flex;
  flex-flow: row nowrap;
  height: 60px;
  align-items: center;
  justify-content: space-between;
}

.header__title {
  color: var(--hs-color-title);
  font-size: var(--hs-font-size-text);
  font-weight: 600;
}

.header__badge {
  margin-right: auto;
  margin-left: 12px;
}

.header__btn-more {
  color: var(--hs-color-clickable-more);
  font-size: var(--hs-font-size-clickable-s);
}

.list-wrap {

}

.list__item {
  height: 66px;
}

.list__item:active {
  background-color: var(--hs-bg-list-item-selected);
}

::v-deep(.van-cell__value) {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  font-size: var(--hs-font-size-text);
}

::v-deep(.van-cell::after) {
  border: none;
}

.item__col {
  white-space: nowrap;
}

.col__1 {
  color: var(--hs-color-title);
  width: 0;
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.col__2 {
  color: var(--hs-color-aide);
}

</style>
