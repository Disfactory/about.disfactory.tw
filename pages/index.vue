<template>
  <div class="home">
    <NavigationHeader />

    <div class="search">
      <FactorySearch
        class="search__factory-search"
        @displayStats="handleDisplayStats"
      />
      <FactoryDisplay
        class="search__factory-display"
        :factories="factories"
        :documents="documents"
        :region="region"
      />
    </div>

    <DataDisplay
      id="do-you-know"
      :totalFactories="totalFactories"
      :totalReportRecords="totalReportRecords"
      :totalDocumentsRate="totalDocumentsRate"
    />

    <BannerJoinUs />

    <ReportTutorial id="report" />

    <CurrentResults
      id="current-results"
      :totalReportRecords="totalReportRecords"
    />

    <AskedQuestions id="faq" />

    <MediaReport id="media" />

    <TheFooter />
  </div>
</template>

<script>
import { ref, computed, onBeforeMount } from '@vue/composition-api'

import NavigationHeader from '~/components/NavigationHeader.vue'
import FactorySearch from '~/components/FactorySearch.vue'
import FactoryDisplay from '~/components/FactoryDisplay.vue'
import DataDisplay from '~/components/DataDisplay.vue'
import BannerJoinUs from '~/components/BannerJoinUs.vue'
import ReportTutorial from '~/components/ReportTutorial.vue'
import CurrentResults from '~/components/CurrentResults.vue'
import AskedQuestions from '~/components/AskedQuestions.vue'
import MediaReport from '~/components/MediaReport.vue'
import TheFooter from '~/components/TheFooter.vue'

import { getNumWithCommas } from '~/utils/index.js'

export default {
  name: 'Home',

  components: {
    NavigationHeader,
    FactorySearch,
    FactoryDisplay,
    DataDisplay,
    BannerJoinUs,
    ReportTutorial,
    CurrentResults,
    AskedQuestions,
    MediaReport,
    TheFooter,
  },

  setup(_, { root: { context: ctx } }) {
    const totalStats = ref({
      factories: undefined,
      documents: undefined,
      reportRecords: undefined,
    })
    const totalFactories = formatNum(totalStats, 'factories')
    const totalReportRecords = formatNum(totalStats, 'reportRecords')
    const totalDocumentsRate = computed(() => {
      if (
        totalStats.value.factories === undefined ||
        totalStats.value.documents === undefined
      ) {
        return ''
      }

      return `${(
        (totalStats.value.documents / totalStats.value.factories) *
        100
      ).toFixed(2)}%`
    })

    const stats = ref({
      region: undefined,
      factories: undefined,
      documents: undefined,
    })
    const factories = formatNum(stats, 'factories')
    const documents = formatNum(stats, 'documents')
    const region = computed(() => {
      const { region } = stats.value

      if (region === undefined) {
        return
      }

      if (region === '全臺灣') {
        return region
      }

      if (region.startsWith('南海諸島')) {
        return `${region.slice(0, 4)} ${region.slice(4)}`
      }

      return `${region.slice(0, 3)} ${region.slice(3)}`
    })

    function formatNum(stats, name) {
      return computed(() => {
        const stat = stats.value[name]

        if (stat === undefined) {
          return ''
        }

        return getNumWithCommas(stat)
      })
    }

    onBeforeMount(() => {
      fetchTotalStats()

      async function fetchTotalStats() {
        try {
          const {
            factories,
            documents,
            report_records: reportRecords,
          } = await ctx.$fetchDisfactoryData('/api/statistics/factories')

          totalStats.value = {
            factories,
            documents,
            reportRecords,
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(err)
        }
      }
    })

    function handleDisplayStats(data) {
      stats.value = data
    }

    return {
      totalFactories,
      totalReportRecords,
      totalDocumentsRate,

      region,
      factories,
      documents,

      handleDisplayStats,
    }
  },
}
</script>

<style lang="scss" scoped>
.search {
  position: relative;
  @include media-breakpoint-up(lg) {
    display: flex;
  }

  &__factory-search {
    @include media-breakpoint-up(lg) {
      width: 54.24%;
      box-sizing: border-box;
    }
  }

  &__factory-display {
    @include media-breakpoint-up(lg) {
      width: 45.76%;
      box-sizing: border-box;
    }
  }
}
</style>
