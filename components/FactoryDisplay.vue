<template>
  <div class="factory-display">
    <SvgFactory class="bg" />

    <SvgSign class="sign-top" />

    <div class="container">
      <div class="text">
        <div class="factories-count">
          <SvgSign class="sign-left" />

          <p>
            <span>{{ factories }}</span
            >工廠
          </p>
        </div>
        <p class="reports-count">
          {{ region }}有 {{ factories }}+ 疑似農地違章工廠<span>，</span
          ><br />有 {{ documents }} 家已被檢舉
        </p>
      </div>

      <div class="actions">
        <button type="button" @click="share">分享</button>
        <a class="where" href="https://disfactory.tw/" target="_blank"
          >在哪裏？！</a
        >
      </div>
    </div>

    <div class="note">*此數字已篩除都市計畫區農地上之工廠數</div>
  </div>
</template>

<script>
import SvgFactory from '~/assets/imgs/factory-pink.svg?inline'
import SvgSign from '~/assets/imgs/sign.svg?inline'

import { OG_TITLE } from '~/constants/meta.js'

export default {
  name: 'FactoryDisplay',

  components: {
    SvgFactory,
    SvgSign,
  },

  props: {
    region: {
      type: String,
      required: true,
      default: '',
    },
    factories: {
      type: String,
      required: true,
      default: '',
    },
    documents: {
      type: String,
      required: true,
      default: '',
    },
  },

  setup() {
    function share() {
      const text =
        '🧧我肚子裡的年菜有被工廠加料嗎？🧧\n\r#農地違章工廠 #即報即拆 #拒絕污染 #加入回報 #disfactory'
      const url = document.location.href
      const copiedText = `${text}\n\r${url}`

      if (navigator.share) {
        navigator
          .share({
            title: OG_TITLE,
            text,
            url,
          })
          .catch(function rejected(err) {
            // eslint-disable-next-line no-console
            console.error(err)

            copy(copiedText)
          })
      } else {
        copy(copiedText)
      }
    }

    async function copy(text) {
      const clipboardCopy = (await import('clipboard-copy')).default

      clipboardCopy(text)
    }

    return {
      share,
    }
  },
}
</script>

<style lang="scss" scoped>
.factory-display {
  background-color: #fa6b62;
  position: relative;
  padding: 64px 22px 8px 22px;
  z-index: 9;
  color: #fff;
  text-align: center;
  @include media-breakpoint-up(sm) {
    padding: 64px 28px 16px 28px;
  }
  @include media-breakpoint-up(md) {
    padding: 64px 28px 52px 28px;
  }
  @include media-breakpoint-up(lg) {
    padding: 48px 8px 52px 8px;
  }
  @include media-breakpoint-up(xl) {
    padding: 48px 8px 52px 5%;
  }
}

.bg {
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: -9;
  @include media-breakpoint-up(md) {
    width: 343px;
  }
}

.sign-top {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  @include media-breakpoint-up(md) {
    width: 64px;
  }
  @include media-breakpoint-up(lg) {
    display: none;
  }
}

.container {
  @include media-breakpoint-up(xl) {
    width: max-content;
    @supports not (width: max-content) {
      width: 90%;
    }
  }
}

.text {
  font-size: 24px;
  margin-bottom: 20px;
  text-shadow: 0 2px 3px rgba(#000, 0.25);
  @include media-breakpoint-up(md) {
    margin-bottom: 28px;
  }
  @include media-breakpoint-up(lg) {
    margin-bottom: 38px;
  }
  @include media-breakpoint-up(xl) {
    font-size: 26px;
  }
}

.factories-count {
  font-weight: 700;
  font-size: 25px;
  line-height: 1.36;
  margin-bottom: 8px;
  @include media-breakpoint-up(md) {
    margin-bottom: 24px;
    font-size: 28px;
  }
  @include media-breakpoint-up(lg) {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    margin-bottom: 16px;
  }
  @include media-breakpoint-up(xl) {
    font-size: 38px;
    align-items: center;
  }

  span {
    font-size: 60px;
    line-height: 1.15;
    margin-right: 34px;
    position: relative;
    @include media-breakpoint-up(md) {
      margin-right: 44px;
    }
    @include media-breakpoint-up(xl) {
      font-size: 78px;
      margin-right: 36px;
    }

    &::after {
      content: '+';
      font-size: 49px;
      position: absolute;
      top: -16px;
      right: -32px;
      @include media-breakpoint-up(xl) {
        top: -12px;
      }
    }
  }
}

.sign-left {
  display: none;

  @include media-breakpoint-up(lg) {
    display: block;
    width: 54px;
    margin-right: 24px;
  }
}

.reports-count {
  span {
    @include media-breakpoint-up(md) {
      display: none;
    }
  }

  br {
    display: none;
    @include media-breakpoint-up(md) {
      display: block;
    }
  }
}

.actions {
  display: flex;
  justify-content: space-between;
  max-width: 325px;
  margin: 0 auto;
  margin-bottom: 10px;
  @include media-breakpoint-up(md) {
    margin-bottom: 0;
  }
}

button,
.where {
  border-radius: 55px;
  font-size: 20px;
  font-weight: 700;
  padding: 12px 0;
  width: 150px;
  box-sizing: border-box;
}

button {
  background-color: #fff;
  border: none;
  color: #457287;
  box-shadow: 0 2px 6px rgba(#000, 0.25);
  margin-right: 6px;

  &:hover {
    background-color: #457287;
    color: #fff;
  }
}

.where {
  background-color: #fa6b62;
  border: 2px solid #fff;
  color: #fff;
  margin-left: 6px;

  &:hover {
    background-color: #ec554c;
    border-color: #ec554c;
  }
}

.note {
  font-size: 14px;
  letter-spacing: 0;
  @include media-breakpoint-up(md) {
    position: absolute;
    right: 24px;
    bottom: 16px;
  }
}
</style>
