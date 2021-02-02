<template>
  <div class="home">
    <div class="search">
      <FactorySearch
        class="search__factory-search"
        @displayCounts="handleDisplayCounts"
      />
      <FactoryDisplay
        class="search__factory-display"
        :factoriesCount="factoriesCount"
        :reportsCount="reportsCount"
        :region="region"
      />
    </div>

    <DataDisplay
      :totalFactories="factoriesCount"
      :totalReports="reportsCount"
      :totalReportsRate="reportsRate"
    />

    <BannerJoinUs />

    <ReportTutorial />

    <CurrentResults :totalReports="reportsCount" />

    <AskedQuestions />
  </div>
</template>

<script>
import { reactive, computed, onBeforeMount } from '@vue/composition-api'

import FactorySearch from '~/components/FactorySearch.vue'
import FactoryDisplay from '~/components/FactoryDisplay.vue'
import DataDisplay from '~/components/DataDisplay.vue'
import BannerJoinUs from '~/components/BannerJoinUs.vue'
import ReportTutorial from '~/components/ReportTutorial.vue'
import CurrentResults from '~/components/CurrentResults.vue'
import AskedQuestions from '~/components/AskedQuestions.vue'

import { getNumWithCommas } from '~/utils/index.js'

export default {
  name: 'Home',

  components: {
    FactorySearch,
    FactoryDisplay,
    DataDisplay,
    BannerJoinUs,
    ReportTutorial,
    CurrentResults,
    AskedQuestions,
  },

  setup(_, { root: { context: ctx } }) {
    const counts = reactive({
      factories: undefined,
      reports: undefined,
      region: '',
    })
    const factoriesCount = computed(() => {
      if (counts.factories === undefined) {
        return
      }

      return getNumWithCommas(counts.factories)
    })
    const reportsCount = computed(() => {
      if (counts.reports === undefined) {
        return
      }

      return getNumWithCommas(counts.reports)
    })
    const region = computed(() => {
      if (counts.region === '全臺灣') {
        return counts.region
      }

      if (counts.region.startsWith('南海諸島')) {
        return `${counts.region.slice(0, 4)} ${counts.region.slice(4)}`
      }

      return `${counts.region.slice(0, 3)} ${counts.region.slice(3)}`
    })
    function setCounts({ factories, reports, region }) {
      counts.factories = factories
      counts.reports = reports
      counts.region = region
    }

    const reportsRate = computed(() => {
      if (counts.reports === undefined || counts.factories === undefined) {
        return ''
      }

      return `${((counts.reports / counts.factories) * 100).toFixed(2)}%`
    })

    onBeforeMount(() => {
      fetchCounts()

      async function fetchCounts() {
        try {
          const [factoriesResponse, reportsResponse] = await Promise.all([
            ctx.$fetchDisfactoryData('/api/statistics/factories'),
            ctx.$fetchDisfactoryData('/api/statistics/report_records'),
          ])

          setCounts({
            factories: factoriesResponse?.count,
            reports: reportsResponse?.count,
            region: '全臺灣',
          })
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(err)
        }
      }
    })

    function handleDisplayCounts(data) {
      setCounts(data)
    }

    return {
      factoriesCount,
      reportsCount,
      region,
      reportsRate,

      handleDisplayCounts,
    }
  },
}
</script>

<style lang="scss" scoped>
.search {
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
