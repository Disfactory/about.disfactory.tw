<template>
  <div class="media-report">
    <BaseSubtitle text="新聞報導" class="media-report__base-subtitle" />

    <div class="container">
      <a
        v-for="report in reports"
        :key="report.id"
        :href="report.href"
        target="_blank"
        rel="noopener"
      >
        <article>
          <picture>
            <source
              type="image/webp"
              :srcset="require(`~/assets/imgs/${report.imgName}.webp`)"
            />
            <img :src="require(`~/assets/imgs/${report.imgName}.png`)" alt="" />
          </picture>
          <h1>{{ report.title }}</h1>
          <div class="date">{{ report.date }}</div>
          <p>{{ report.description }}</p>
        </article>
      </a>
    </div>
  </div>
</template>

<script>
import BaseSubtitle from '~/components/BaseSubtitle.vue'

export default {
  name: 'MediaReport',

  components: {
    BaseSubtitle,
  },

  setup() {
    return {
      reports: [
        {
          id: 1,
          href: 'https://www.newsmarket.com.tw/blog/132789/',
          imgName: 'news-and-market',
          title: '看準政府不會拆，違章工廠衝衝衝',
          date: '2020.05.26',
          description:
            '《工輔法》要求即報即拆，違章工廠卻不減反增。說好的中高污染工廠轉型退場呢？',
        },
        {
          id: 2,
          href:
            'https://www.twreporter.org/a/illegal-factory-on-agricultural-land-law-anniversary',
          imgName: 'the-reporter',
          title: '【工輔法修法週年進度追蹤】',
          date: '2020.06.22',
          description:
            '逾萬違章工廠身分未清查、拆除進度零增加、未登工廠申請納管比例低於1成',
        },
        {
          id: 3,
          href:
            'https://www.businesstoday.com.tw/article/category/80392/post/202005270021/%E3%80%8C%E5%8D%B3%E5%A0%B1%E5%8D%B3%E6%8B%86%E3%80%8D%E8%B7%B3%E7%A5%A8%20%20%E9%81%95%E7%AB%A0%E5%B7%A5%E5%BB%A0%E5%9B%9B%E5%B9%B4%E5%A2%9E%E5%9B%9B%E7%99%BE%E5%A4%9A%E4%BB%B6',
          imgName: 'business-today',
          title: '「即報即拆」跳票 違章工廠四年增四百多件',
          date: '2020.05.27',
          description:
            '蔡政府第一任期喊出農地新增違建即報即拆，但各縣市配合情況不一，四年過去成績慘澹',
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.media-report {
  padding: 40px 24px;
  @include media-breakpoint-up(lg) {
    padding: 80px 40px;
  }

  &__base-subtitle {
    margin-bottom: 32px;
    @include media-breakpoint-up(lg) {
      margin-bottom: 40px;
    }
  }
}

.container {
  @include media-breakpoint-up(lg) {
    display: flex;
    align-items: flex-start;
    max-width: 1056px;
    margin: 0 auto;
  }
}

img {
  margin-bottom: 20px;
}

a {
  color: #333;
  display: block;
  max-width: 320px;
  box-shadow: 0 0 7px rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  padding: 40px 32px;
  box-sizing: border-box;
  margin: 0 auto;
  @include media-breakpoint-up(lg) {
    width: calc(100% / 3 - 32px);
  }

  + a {
    margin-top: 36px;
    @include media-breakpoint-up(lg) {
      margin-top: 0;
    }
  }

  &:nth-child(1) img {
    width: 182px;
  }

  &:nth-child(2) img {
    width: 192px;
  }

  &:nth-child(3) img {
    width: 85px;
  }
}

h1 {
  font-weight: 700;
  font-size: 20px;
  margin-bottom: 4px;
}

.date {
  font-size: 14px;
}

p {
  font-size: 17px;
}
</style>
