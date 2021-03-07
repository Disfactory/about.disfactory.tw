<template>
  <div class="current-results">
    <BaseSubtitle text="目前成果" class="current-results__base-subtitle" />

    <div class="result result--chart">
      <h3>各縣市回報進度</h3>
      <p class="description">來看看哪個縣市回報的比例最高？</p>

      <div class="chart">
        <div ref="barChartDom"></div>
      </div>

      <div class="legend">
        <span />
        <p>累積回報數量 / 疑似違章工廠數量 %</p>
      </div>

      <div v-if="theLastCity" class="message">
        <SvgDialog />
        <p>{{ theLastCity }}民眾要加油囉！👊</p>
      </div>
    </div>

    <div class="result result--call">
      <h3>眾志成城，還差你一個！</h3>
      <SvgPhotoHtml />
      <div class="num">{{ totalReportRecords }}</div>
      <div>累積回報人次</div>
    </div>

    <div class="result result--chart">
      <h3>各縣市處理進度排行</h3>
      <p class="description">來看看哪個縣市處理得最快？哪個縣市吊車尾？</p>

      <div class="chart">
        <div ref="heatmapChartDom"></div>
      </div>

      <p class="note">備註：{{ citiesNoDocuments.join('、') }}還沒有檢舉成案</p>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from '@vue/composition-api'
import { init, use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import {
  GridComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components'
import { BarChart, HeatmapChart } from 'echarts/charts'

import BaseSubtitle from '~/components/BaseSubtitle.vue'

import SvgDialog from '~/assets/imgs/dialog.svg?inline'
import SvgPhotoHtml from '~/assets/imgs/take-a-photo.svg?inline'

const PROGRESS = Object.freeze(['未處理', '處理中', '已斷電', '已拆除'])

export default {
  name: 'CurrentResults',

  components: {
    BaseSubtitle,

    SvgDialog,
    SvgPhotoHtml,
  },

  props: {
    totalReportRecords: {
      type: String,
      required: true,
      default: '',
    },
  },

  setup(_, { root: { context: ctx } }) {
    const barChartDom = ref(null)
    const heatmapChartDom = ref(null)
    const reportRates = ref([])
    const progresses = ref([])
    const citiesNoDocuments = ref([])

    onMounted(async function () {
      await fetchStatsTotal()

      use([
        GridComponent,
        TooltipComponent,
        VisualMapComponent,
        BarChart,
        HeatmapChart,
        CanvasRenderer,
      ])
      const Y_AXIS_ITEM_HEIGHT = 48
      const sharedTextStyle = {
        color: '#333',
        fontFamily:
          'Helvetica, "Helvetica Neue", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, "Noto Sans CJK TC", "Noto Sans CJK", "Source Han Sans", "PingFang TC", "Hiragino Sans GB", "Microsoft JhengHei", sans-serif',
      }
      const sharedYAxisLabel = { fontSize: 16, margin: 16 }

      const totalReportRates = reportRates.value.length
      const reportsRateBarChart = init(barChartDom.value, 'light', {
        height: Y_AXIS_ITEM_HEIGHT * totalReportRates,
      })
      const maxRate = reportRates.value[totalReportRates - 1]
      let xAxisMax
      if (maxRate !== undefined) {
        xAxisMax = roundToNearest10(maxRate.value * 2)
      }
      reportsRateBarChart.setOption({
        xAxis: {
          type: 'value',
          axisLabel: { formatter: '{value}%', fontSize: 14, margin: 16 },
          min: 0,
          max: xAxisMax,
        },
        yAxis: {
          type: 'category',
          data: reportRates.value.map(getCity),
          axisLabel: sharedYAxisLabel,
        },
        series: [
          {
            name: '回報率',
            type: 'bar',
            data: reportRates.value.map(getValue),
            barWidth: 18,
          },
        ],
        grid: { top: 0, right: 24, bottom: 0, left: 8, containLabel: true },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
        },
        color: ['#fa6b62'],
        textStyle: sharedTextStyle,
      })

      const progressHeatmapChart = init(heatmapChartDom.value, 'light', {
        height: Y_AXIS_ITEM_HEIGHT * progresses.value.length,
      })
      const casesByCity = progresses.value.flatMap(getValue)
      const maxCases = casesByCity.reduce(function (cases1, [, , cases2]) {
        return Math.max(cases1, cases2)
      }, 0)
      progressHeatmapChart.setOption({
        xAxis: {
          type: 'category',
          position: 'top',
          data: PROGRESS,
          zlevel: 1,
          axisPointer: { type: 'none' },
        },
        yAxis: {
          type: 'category',
          data: progresses.value.map(getCity),
          axisLabel: sharedYAxisLabel,
          zlevel: 1,
        },
        series: [
          {
            type: 'heatmap',
            data: casesByCity,
            label: { show: true },
            itemStyle: {
              borderWidth: 1,
              borderColor: '#fff',
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 8,
                shadowColor: 'rgba(0, 0, 0, 0.4)',
              },
            },
          },
        ],
        visualMap: {
          min: 0,
          max: roundToNearest10(maxCases),
          inRange: {
            color: ['#ececec', '#fff9e6', '#fc9e91', '#e9382d', '#b82118'],
          },
          orient: 'horizontal',
          left: 'center',
          text: ['件數'],
          textGap: 16,
          calculable: true,
          padding: 0,
          itemHeight: 184,
        },
        grid: { top: 8, right: 0, left: 8, containLabel: true },
        tooltip: {},
        textStyle: sharedTextStyle,
        media: [
          {
            query: { minWidth: 320 },
            option: {
              xAxis: { axisLabel: { fontSize: 14, margin: 12 } },
            },
          },
          {
            option: {
              xAxis: { axisLabel: { fontSize: 12, margin: 12 } },
            },
          },
        ],
      })

      window.addEventListener('resize', resizeCharts)
      window.addEventListener('orientationchange', resizeCharts)

      async function fetchStatsTotal() {
        const response = await ctx.$fetchDisfactoryData('/api/statistics/total')
        const entries = Object.entries(response).filter(
          function doesHaveFactories([_, data]) {
            return data.factories > 0
          }
        )

        reportRates.value = entries
          .map(function transformContent([city, data]) {
            return {
              city,
              value: Number(
                ((data.report_records / data.factories) * 100).toFixed(2)
              ),
            }
          })
          .sort(function ascendByValue(a, b) {
            return a.value - b.value
          })

        progresses.value = entries
          .sort(function ascendByStage1([, data1], [, data2]) {
            return data1[PROGRESS[0]] - data2[PROGRESS[0]]
          })
          .map(function transformContent([city, data], cityIdx) {
            return {
              city,
              value: PROGRESS.map(function buildValue(stage, stageIdx) {
                return [stageIdx, cityIdx, data[stage]]
              }),
            }
          })

        citiesNoDocuments.value = entries
          .filter(function doesHaveNoDocuments([_, data]) {
            return data.documents === 0
          })
          .map(function getCity([city]) {
            return city
          })
      }

      function roundToNearest10(num) {
        return Math.ceil(Math.ceil(num) / 10) * 10
      }

      function resizeCharts() {
        reportsRateBarChart.resize()
        progressHeatmapChart.resize()
      }
    })

    function getCity(item) {
      return item.city
    }
    function getValue(item) {
      return item.value
    }

    const theLastCity = computed(() => {
      return reportRates.value[reportRates.value.length - 1]?.city || ''
    })

    return {
      barChartDom,
      theLastCity,

      heatmapChartDom,
      citiesNoDocuments,
    }
  },
}
</script>

<style lang="scss" scoped>
.current-results {
  padding: 40px 16px;
  text-align: center;
  @include media-breakpoint-up(lg) {
    padding: 80px 40px;
  }

  &__base-subtitle {
    margin-bottom: 32px;
    @include media-breakpoint-up(lg) {
      margin-bottom: 56px;
    }
  }
}

.chart {
  margin-bottom: 40px;
  min-height: 816px; // 48 * 17
  text-align: left;
}

.result {
  margin: 0 auto;

  &--chart {
    max-width: 520px;
  }

  &--call {
    max-width: 800px;
    border-top: 1px solid #d9e0a2;
    border-bottom: 1px solid #d9e0a2;
    margin: 56px auto;
    padding: 72px 0;
    font-weight: 700;
    font-size: 22px;

    svg {
      max-width: 264px;
      margin-bottom: 8px;
    }

    .num {
      font-size: 100px;
      line-height: 1;
      color: #fa6b62;
      margin-bottom: 16px;
    }
  }
}

h3 {
  font-weight: 700;
  font-size: 30px;
  line-height: 44px;
  margin-bottom: 24px;
}

.description {
  font-size: 17px;
  margin-bottom: 32px;
}

.legend {
  font-size: 16px;
  display: flex;
  align-items: center;
  padding-left: 6px;
  text-align: left;

  span {
    width: 22px;
    height: 22px;
    background-color: #fa6b62;
    margin-right: 16px;
    flex-shrink: 0;
  }
}

.message {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 24px;

  p {
    position: absolute;
    top: 22px;
  }
}

.note {
  font-size: 16px;
  margin-top: 8px;
}
</style>
