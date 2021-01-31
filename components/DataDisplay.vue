<template>
  <div class="data-display">
    <h2>你知道嗎？</h2>

    <p class="description">
      沒有違章工廠的台灣農業區域，跟日本壓縮機一樣稀少<br />因為有被檢舉的違章工廠，也很稀少。
    </p>

    <div class="container">
      <div v-for="item in items" :key="item.id" class="data">
        <!-- eslint-disable vue/no-v-html -->
        <div class="icon" v-html="item.iconHtml"></div>

        <div class="text">
          <p>{{ item.text1 }}</p>
          <p>
            <span class="num">{{ item.num }}</span
            ><span v-html="item.text2"></span>
          </p>
        </div>
        <!-- eslint-enable vue/no-v-html -->
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from '@vue/composition-api'

import SvgFactory from '~/assets/imgs/factory.svg?raw'
import SvgPaper from '~/assets/imgs/paper.svg?raw'
import SvgPhoto from '~/assets/imgs/take-a-photo.svg?raw'

export default {
  name: 'DataDisplay',

  props: {
    totalFactories: {
      type: String,
      required: true,
      default: '',
    },
    totalReports: {
      type: String,
      required: true,
      default: '',
    },
    totalReportsRate: {
      type: String,
      required: true,
      default: '',
    },
  },

  setup(props) {
    const items = computed(() => [
      {
        id: 1,
        iconHtml: SvgFactory,
        text1: '農地上有',
        num: props.totalFactories,
        text2: '間農地違章工廠',
      },
      {
        id: 2,
        iconHtml: SvgPaper,
        text1: '只有',
        num: props.totalReportsRate,
        text2: '違規工廠<br />已遭檢舉',
      },
      {
        id: 3,
        iconHtml: SvgPhoto,
        text1: '目前',
        num: props.totalReports,
        text2: '人參與',
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
  @include media-breakpoint-up(lg) {
    padding: 80px 40px;
  }
}

h2 {
  font-weight: 700;
  font-size: 38px;
  color: #2b4754;
  letter-spacing: 2px;
  margin-bottom: 28px;
}

.description {
  font-size: 22px;
  margin-bottom: 36px;
}

.container {
  display: inline-block;
  @include media-breakpoint-up(lg) {
    display: flex;
    margin: 0 auto;
    max-width: 1100px; // 350 * 3 + 70 * 2
    align-items: flex-start;
    justify-content: space-between;
  }
}

.data {
  font-weight: 700;
  font-size: 24px;
  line-height: 1.3;
  max-width: 320px;
  @include media-breakpoint-up(lg) {
    width: calc(100% / 3 - 16px);
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
    height: auto;
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
</style>
