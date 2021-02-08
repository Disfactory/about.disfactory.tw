<template>
  <div class="data-display">
    <BaseSubtitle text="你知道嗎？" class="data-display__base-subtitle" />

    <p class="description">
      沒有違章工廠的台灣農業區域，跟日本壓縮機一樣稀少<br />因為有被檢舉的違章工廠，也很稀少。
    </p>

    <div class="container">
      <div class="wrapper">
        <div v-for="item in items" :key="item.id" class="data">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="icon" v-html="item.iconHtml"></div>

          <div class="text">
            <p>{{ item.text1 }}</p>
            <p>
              <!-- eslint-disable vue/no-v-html -->
              <span class="num">{{ item.num }}</span
              ><span v-html="item.text2"></span>
              <!-- eslint-enable vue/no-v-html -->
            </p>
          </div>
        </div>
      </div>

      <p class="note">
        資料來源｜<a
          href="https://map.coa.gov.tw/farmland/survey.html"
          target="_blank"
          rel="noopener"
          >農委會農業及農地資源盤查結果</a
        >、<a href="https://disfactory.tw" target="_blank" rel="noopener"
          >本回報系統</a
        >
      </p>
    </div>
  </div>
</template>

<script>
import { computed } from '@vue/composition-api'

import BaseSubtitle from '~/components/BaseSubtitle.vue'

import svgFactoryHtml from '~/assets/imgs/factory.svg?raw'
import svgPaperHtml from '~/assets/imgs/paper.svg?raw'
import svgPhotoHtml from '~/assets/imgs/take-a-photo.svg?raw'

export default {
  name: 'DataDisplay',

  components: {
    BaseSubtitle,
  },

  props: {
    totalFactories: {
      type: String,
      required: true,
      default: '',
    },
    totalReportRecords: {
      type: String,
      required: true,
      default: '',
    },
    totalDocumentsRate: {
      type: String,
      required: true,
      default: '',
    },
  },

  setup(props) {
    const items = computed(() => [
      {
        id: 1,
        iconHtml: svgFactoryHtml,
        text1: '農地上有',
        num: props.totalFactories,
        text2: '間農地違章工廠',
      },
      {
        id: 2,
        iconHtml: svgPaperHtml,
        text1: '只有',
        num: props.totalDocumentsRate,
        text2: '違規工廠已遭<br />地球公民檢舉',
      },
      {
        id: 3,
        iconHtml: svgPhotoHtml,
        text1: '目前',
        num: props.totalReportRecords,
        text2: '<br />人參與',
      },
    ])

    return {
      items,
    }
  },
}
</script>

<style lang="scss" scoped>
.data-display {
  padding: 40px 24px;
  text-align: center;
  position: relative;
  @include media-breakpoint-up(lg) {
    padding: 80px 40px;
  }

  &__base-subtitle {
    margin-bottom: 32px;
  }
}

.description {
  font-size: 22px;
  margin-bottom: 36px;
}

.container {
  margin: 0 auto;
  max-width: 1100px; // 350 * 3 + 70 * 2
}

.wrapper {
  display: inline-block;
  margin-bottom: 40px;
  @include media-breakpoint-up(lg) {
    display: flex;
    margin-bottom: 48px;
    align-items: flex-start;
    justify-content: space-between;
  }
}

.data {
  font-weight: 700;
  font-size: 24px;
  line-height: 1.3;
  max-width: 328px;
  @include media-breakpoint-up(lg) {
    width: calc(100% / 3 - 16px);
  }

  &:nth-child(2) p:last-of-type span:last-child {
    font-size: 20px;
    @include media-breakpoint-up(xl) {
      font-size: inherit;
    }
  }

  + .data {
    margin-top: 56px;
    @include media-breakpoint-up(lg) {
      margin-top: 0;
    }
  }

  p {
    &:first-of-type {
      margin-bottom: 4px;
    }

    &:last-of-type {
      display: flex;
      align-items: flex-end;
    }
  }
}

.icon {
  max-width: 186px;
  margin: 0 auto;
  margin-bottom: 8px;
  @include media-breakpoint-up(sm) {
    max-width: 320px;
    margin-bottom: 10px;
  }

  &::v-deep svg {
    width: 100%;
    display: block;
  }
}

.text {
  display: inline-block;
  text-align: left;
}

.num {
  font-size: 54px;
  line-height: 1;
  color: #fa6b62;
  margin-right: 14px;
}

.note {
  font-size: 14px;
  line-height: 1.3;
  text-align: right;
  color: #979797;
}

a {
  color: inherit;
  text-decoration: underline;
}
</style>
