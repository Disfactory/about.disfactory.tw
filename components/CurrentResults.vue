<template>
  <div class="current-results">
    <BaseSubtitle text="目前成果" class="current-results__base-subtitle" />

    <div class="result result--bar">
      <h3>各縣市回報進度</h3>
      <p class="description">來看看哪個縣市回報的比例最高？</p>

      <div class="chart">
        <BarChart
          v-if="reportsRateBarChart.data.value !== 'no data'"
          :data="reportsRateBarChart.data.value"
          :options="reportsRateBarChart.options"
        />
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

    <div class="result result--heatmap">
      <h3>各縣市處理進度排行</h3>
      <p class="description">來看看哪個縣市處理得最快？哪個縣市吊車尾？</p>

      <div class="chart">
        <HeatmapChart
          v-if="progressHeatmapChart.data.value !== 'no data'"
          :data="progressHeatmapChart.data.value"
          :options="progressHeatmapChart.options"
        />
      </div>

      <p class="note">備註：{{ citiesNoDocuments.join('、') }}還沒有檢舉成案</p>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, reactive, ref } from '@vue/composition-api'
import '@toast-ui/chart/dist/toastui-chart.min.css'
import {
  barChart as BarChart,
  heatmapChart as HeatmapChart,
} from '@toast-ui/vue-chart'

import BaseSubtitle from '~/components/BaseSubtitle.vue'

import SvgDialog from '~/assets/imgs/dialog.svg?inline'
import SvgPhotoHtml from '~/assets/imgs/take-a-photo.svg?inline'

export default {
  name: 'CurrentResults',

  components: {
    BaseSubtitle,
    BarChart,
    HeatmapChart,

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
    const reportRates = ref([])
    const progresses = ref([])
    const citiesNoDocuments = ref([])

    onMounted(function () {
      fetchStatsTotal()

      async function fetchStatsTotal() {
        const response = await ctx.$fetchDisfactoryData('/api/statistics/total')
        const entries = Object.entries(response).filter(
          function doesHaveFactories([_, data]) {
            return data.factories > 0
          }
        )

        reportRates.value = entries
          .map(function getReportRate([city, data]) {
            return {
              city,
              value: Number(
                ((data.report_records / data.factories) * 100).toFixed(2)
              ),
            }
          })
          .sort(function ascendByValue(a, b) {
            return b.value - a.value
          })

        progresses.value = entries
          .map(function getProgress([city, data]) {
            return {
              city,
              value: [data.未處理, data.處理中, data.已斷電, data.已拆除],
            }
          })
          .sort(function descendBySum(a, b) {
            return sum(a.value) - sum(b.value)
          })

        citiesNoDocuments.value = entries
          .filter(function doesHaveNoDocuments([_, data]) {
            return data.documents === 0
          })
          .map(function getCity([city]) {
            return city
          })
      }
    })

    function sum(nums) {
      return nums.reduce((acc, cur) => acc + cur)
    }

    const commonOptions = {
      exportMenu: { visible: false },
      usageStatistics: false,
    }
    const commonThemes = {
      xAxis: { label: { color: '#333', fontSize: 14 } },
      yAxis: { label: { color: '#333', fontSize: 16 } },
    }

    let reportsRateBarChart
    {
      const xAxis = reactive({
        label: { formatter: getPercent, margin: 4 },
        scale: computed(() => {
          const maxRate = reportRates.value[0]

          if (maxRate === undefined) {
            return {}
          }

          const max = roundToNearest10(maxRate.value * 2)

          return {
            min: 0,
            max,
            stepSize: max / 5,
          }

          function roundToNearest10(num) {
            return Math.ceil(Math.ceil(num) / 10) * 10
          }
        }),
      })

      reportsRateBarChart = {
        data: computed(() => {
          if (reportRates.value.length <= 0) {
            return 'no data'
          }

          return {
            categories: reportRates.value.map(getCity),
            series: [
              {
                name: '回報率',
                data: reportRates.value.map(getValue),
              },
            ],
          }
        }),
        options: {
          chart: createChartInOptions(reportRates),
          xAxis,
          yAxis: { label: { margin: 8 } },
          tooltip: { formatter: getPercent },
          theme: {
            series: { barWidth: 16, colors: ['#fa6b62'] },
            ...commonThemes,
          },
          legend: { visible: false },
          ...commonOptions,
        },
      }
    }

    const progressHeatmapChart = {
      data: computed(() => {
        if (progresses.value.length <= 0) {
          return 'no data'
        }

        return {
          categories: {
            x: ['未處理', '處理中', '已斷電', '已拆除'],
            y: progresses.value.map(getCity),
          },
          series: progresses.value.map(getValue),
        }
      }),
      options: {
        chart: createChartInOptions(progresses),
        xAxis: { label: { margin: 4 } },
        yAxis: { label: { margin: 16 } },
        tooltip: { formatter: (value) => `${value} 件` },
        legend: { align: 'bottom', width: 256 },
        series: { dataLabels: { visible: true } },
        theme: {
          series: {
            startColor: '#fff9e6',
            endColor: '#b82118',
            borderWidth: 1,
            dataLabels: { color: '#333' },
          },
          ...commonThemes,
        },
        ...commonOptions,
      },
    }

    function createChartInOptions(data) {
      return reactive({
        width: 'auto',
        height: computed(() => 48 * data.value.length),
        animation: false,
      })
    }

    function getPercent(num) {
      return `${num}%`
    }

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
      reportsRateBarChart,
      theLastCity,

      progressHeatmapChart,
      citiesNoDocuments,
    }
  },
}
</script>

<style lang="scss" scoped>
.current-results {
  padding: 40px 24px;
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
  margin: 0 -8px;
  min-height: 816px; // 48 * 17
}

.result {
  margin: 0 auto;

  &--bar {
    max-width: 504px;
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

  &--heatmap {
    max-width: 544px;
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
  margin-bottom: 24px;
}

.legend {
  font-size: 16px;
  display: flex;
  align-items: center;
  padding-left: 12px;

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
