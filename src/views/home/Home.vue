<!-----------------------------------------------------------------------------
- 功能说明：首页组件
- 版权说明：quJie  版权所有
- 创建：quJie 2021-09-28
- 修改：
------------------------------------------------------------------------------->
<template>
  <div class="body">
    <!--    <van-notice-bar
            left-icon="volume-o"
            text="在代码阅读过程中人们说脏话的频率是衡量代码质量的唯一标准。"
        />-->
    <div class="center-area">

      <section class="top-bg">
        <section class="bg-item-circle bg-item__top-right"></section>
        <section class="bg-item-circle bg-item__center"></section>
        <section class="bg-item-circle bg-item__bottom-left"></section>
      </section>

      <!--用户信息-->
      <div class="user">
        <img class="user_img" src="../../assets/headImg.png">
        <div class="user_text">早上好！瞿杰</div>
        <div class="user_tips">努力和自律本就是生命应有的状态，充实且美好......</div>
      </div>


      <custom-panel style="margin-top: 150px">
        <van-row>
          <van-col span="20">
            本周概况
            <van-icon :name="showPanelData?'eye-o':'closed-eye'" @click="showPanelData=!showPanelData"/>

          </van-col>
          <van-col span="4" style="font-size: 12px">
            <router-link to="/panel-module" tag="span" style="color: white">
              编辑
              <van-icon name="edit"/>
            </router-link>

          </van-col>
        </van-row>


        <van-grid
          :border="false"
          :column-num="2">
          <van-grid-item v-for="item in userInfo.panelModule" v-show="item.display">
            <div class="panel-title">{{ item.name }}</div>
            <div class="panel-num">{{ showPanelData ? '0.00' : '****' }}</div>
          </van-grid-item>
        </van-grid>

      </custom-panel>

      <!--进销指标 -->
      <custom-panel title="进/销指标">
        <div id="inOut-chart"></div>
      </custom-panel>

      <!--热门组织-->
      <custom-table title="本月热门组织" :data="hotList" :cols="hotCols"/>


    </div>

  </div>
</template>

<script lang="ts">
/*用户信息类*/
class userInfo {
  username: String
  panelModule: Object []

  constructor() {
    this.username = ''
    this.panelModule = []
  }

}

import * as echarts from 'echarts';
import {onBeforeMount, reactive, toRefs, nextTick} from "vue";
import {useStore} from 'vuex'
import http from '../../api/request'

export default {
  name: "Home",
  setup() {
    const store = useStore()
    let data = reactive({
      showPanelData: true,
      userInfo: {}
    } as {
      showPanelData: boolean,
      userInfo: userInfo
    })
    /*    const userImgStyle={
          backgroundImage:`url(${require('../../assets/headImg.png')})`
        }*/

    const hotList = [
      {
        name: '青岛海信连锁青岛路店',
        code: 103,
        address: '山东省青岛市'
      },
      {
        name: '青岛海信连锁江西路店',
        code: 96,
        address: '山东省青岛市'
      },
      {
        name: '青岛海信连锁莱西1店',
        code: 94,
        address: '山东省青岛市'
      },
      {
        name: '青岛海信连锁香港中路店',
        code: 93,
        address: '山东省青岛市'
      },
      {
        name: '青岛海信连锁李村路店',
        code: 91,
        address: '山东省青岛市'
      }
    ]

    const hotCols = [
      {
        title: '组织',
        field: 'name',
        align: 'left',
        width: '180px',
        titleColor: '#000000',
        color: '#216FED'
      },
      {
        title: '成交量',
        field: 'code',
        align: 'right',
        titleColor: '#000000',
        color: '#000000'
      },
    ]

    //////////////////////////////////// 生命周期 ////////////////////////////////////

    onBeforeMount(() => {
      data.userInfo = store.state.user.userInfo
    })

    nextTick(() => {
      setInOutChart()
    })

    function setInOutChart() {
      const chartDom = document.getElementById('inOut-chart');
      const myChart = echarts.init(chartDom);
      let option;

      option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['进货量', '出货量']
        },
        grid: {
          left: '3%',
          right: '2%',
          bottom: '6%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLabel: {
            fontSize: 12,
            align: 'right'
          },
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            fontSize: 12
          },
        },
        series: [
          {
            name: '进货量',
            type: 'line',
            stack: 'Total',
            lineStyle: {
              width: 2,
            },
            symbol: 'circle',
            symbolSize: 5,
            data: [120, 132, 101, 134, 90, 230, 210, 156, 234, 184, 166, 870]
          },
          {
            name: '出货量',
            type: 'line',
            stack: 'Total',
            lineStyle: {
              width: 2
            },
            symbol: 'circle',
            symbolSize: 5,
            data: [220, 182, 191, 234, 290, 330, 310, 144, 208, 135, 245, 670]
          },
        ]
      };

      option && myChart.setOption(option);
    }

    return {
      ...toRefs(data),
      hotList,
      hotCols
    }
  }
}
</script>

<style scoped>
.center-area {
  top: -40px;
  overflow-y: scroll;
  position: absolute;
  left: 0;
  /*top: 100px;*/
  right: 0;
  bottom: 0;
}

/* 顶部背景 */
.top-bg {
  position: absolute;
  height: 200px;
  width: 100%;
  background-image: var(--sc-nav-bar-background);
  overflow: hidden;
}


.bg-item-circle {
  background-color: white;
  opacity: 0.1;
  border-radius: 50%;
  position: absolute;
}

.bg-item__top-right {
  width: 160px;
  height: 160px;
  right: -20px;
  top: -30px;
}

.bg-item__center {
  width: 50px;
  height: 50px;
  top: 43%;
  left: 30%;
}

.bg-item__bottom-left {
  width: 200px;
  height: 200px;
  bottom: -80px;
  left: -40px;
}

/* 用户信息 */
.user {
  height: 100px;
  position: absolute;
  width: 100%;
}

.user_img {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  position: absolute;
  left: 20px;
  top: 40px;
}
.user_text{
  position: relative;
  top: 50px;
  left: 80px;
  font-size: 20px;
  color: white;
}
.user_tips{
  width: 80%;
  position: absolute;
  top: 90px;
  left: 40px;
}

::v-deep(.van-grid-item__content) {
  background-color: transparent !important;
  justify-content: space-between;
  padding: 8px;
  height: 60px;
}

::v-deep(.van-grid-item__content--center) {
  align-items: flex-start;
}

.panel-title {
  font-size: 12px;
}

.panel-num {
  font-size: 18px;
  font-weight: bold;
}

/* 图表 */
#inOut-chart {
  width: 100%;
  height: 200px;
}
</style>
