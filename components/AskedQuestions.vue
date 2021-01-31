<template>
  <div class="asked-questions">
    <BaseSubtitle text="常見問題" class="asked-questions__base-subtitle" />

    <div class="container">
      <div
        v-for="(question, idx) in questions"
        :key="question.topic"
        class="question"
      >
        <div class="topic" @click="toggleQuestion(idx)">
          <div class="toggle">
            <SvgClose v-if="question.shouldOpen" />
            <SvgOpen v-else />
          </div>
          <h3>{{ question.topic }}</h3>
        </div>

        <div v-if="question.shouldOpen">
          <div
            v-for="content in question.contents"
            :key="content.title"
            class="content"
          >
            <div class="q">
              <SvgQ />
            </div>
            <div>
              <h4>{{ content.title }}</h4>
              <!-- eslint-disable-next-line vue/require-v-for-key vue/no-v-html -->
              <p v-for="answer in content.answers" v-html="answer"></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from '@vue/composition-api'

import BaseSubtitle from '~/components/BaseSubtitle.vue'

import SvgOpen from '~/assets/imgs/open.svg?inline'
import SvgClose from '~/assets/imgs/close.svg?inline'
import SvgQ from '~/assets/imgs/q.svg?inline'

export default {
  name: 'AskedQuestions',

  components: {
    BaseSubtitle,

    SvgOpen,
    SvgClose,
    SvgQ,
  },

  setup() {
    const questions = reactive([
      {
        topic: '了解此專案',
        shouldOpen: false,
        contents: [
          {
            title: '這個網站要做什麼？',
            answers: [
              '協助民眾回報農地上的違章工廠。使用者可以點選圖標補充既有違章工廠資訊，也可以自己新增圖點回報。',
            ],
          },
          {
            title: '為何需要大家回報？',
            answers: [
              '農工混雜問題已經在台灣持續半世紀，但在政府2010年增訂專門條文處理農地違章工廠後，情況並沒有改善，農地總量甚至是加速失血。根據農委會2017年的農地資源盤查，當時仍有13萬家疑似違章工廠，佔農地1.4萬公頃，其中約四萬家是在修法後新增。最大的原因除了不肖業者鑽法律漏洞，地方政府不願履行農地管理工作是更該被檢討的現象。',
              '讓人稍稍寬慰的是，<strong>去年《工廠管理輔導法》（簡稱《工輔法》）增修「中央介入條款」，授權中央政府在地方政府怠惰拆除違章工廠時得介入處理</strong>：以「斷水斷電」的手段，迫使工廠認賠殺出。然而，<strong>要啟動拆除或斷水電程序，一切都必須從「檢舉」開始。</strong>',
              '新《工輔法》將農地違章工廠分成三類進行處理：以2016年5月20日為界，之前的定義為「既有」，之後則稱作「新增建」；既有工廠可再依據業別分為「低污染」及「非屬低污染」（即「中高污染」）。中央政府為求這些未登記工廠願意「自首」登記，對「既有工廠」的策略採「就地輔導」為主；<strong>但面對「新增建」則預計採取鐵腕的「即報即拆」手段。</strong>',
              '然而，<strong>過去十年的檢舉與執法經驗已經讓地方受害民眾失去對體制的信任。</strong>「即報即拆」的政策在2017年就曾拋出，但當時實際拆除家數是17家。民眾過去多的是檢舉之後無消無息的經驗，除了顯有政府、民代包庇縱容的跡象，亦有檢舉隔天門口被潑瀝青的案例。「檢舉」一方面是公害受害者最後的武器，一方面卻也是讓弱者破滅的最後一個希望。',
              '<strong>但我們願意再相信政府一次。</strong>重新修法的過程中，經濟部與立委們誇下海口，加入了「新增建即報即拆」、「中高污染遷廠輔導」、「低污染就地特登」就能讓未登記工廠「全面納管」。<strong>我們「相信」的方式，就是比以前更加賣力的檢舉，讓政府展現魄力，全面拆除「新增建違章工廠」。</strong>此一行動除了考驗政府究竟重不重視台灣糧食安全、農民的種植權益、民眾的食品安全以及合法廠商的生存權，也檢驗著台灣社會公民行動的力量是否足以捍衛自身的環境權益，守護下一代的永續未來。',
              '<strong>邀請您與我們一同使用此系統，讓台灣的農業環境能夠永保安康。</strong>',
            ],
          },
        ],
      },
      {
        topic: '我想回報但是⋯',
        shouldOpen: false,
        contents: [
          {
            title: '有使用教學嗎？',
            answers: [
              '進入disfactory之後，頁面上方功能列最左側可找到回報步驟的截圖。如有問題，請電洽地球公民基金會（02-23920371）。',
            ],
          },
          {
            title: '「回報」之後會直接變成檢舉嗎？',
            answers: [
              '本系統為協助民眾回報違章資訊，並非實際完成舉報。2016.05.20 前的違章工廠我們將持續收集資訊，但本系統優先針對2016.5.20之後的新增建違章工廠及之前的中高污染違章工廠進行舉報。',
            ],
          },
          {
            title: '「既有違章工廠」是什麼意思？',
            answers: [
              '既有疑似違章工廠資料來源為 2019 年 7 月 30 日取自內政部<a href="https://maps.nlsc.gov.tw/" target="_blank" rel="noopener">國土測繪圖資雲</a>，為農委會2018年透過空拍圖盤查全台農地變異使用之資料。',
            ],
          },
        ],
      },
      {
        topic: '我正看到工廠想回報，但遇到⋯',
        shouldOpen: false,
        contents: [
          {
            title: '我遇到使用問題該怎麼辦（例如：網站壞掉、資料有誤）',
            answers: [
              '如果您遇到網站使用疑問，請進入<a href="https://airtable.com/shrUraKakZRpH52DO" target="_blank" rel="noopener">表單</a>填寫問題，我們會盡快處理。',
            ],
          },
          {
            title: '為何都市計畫農業區不在回報範圍內？',
            answers: [
              '雖然本會希望新增建能夠全部拆除，但若就政府處理量能來預測舉報後成效，極有可能因為都市計畫農業區相關法規強度較非都市土地更強、效率更高，演變成工廠從都市計畫農業區跑到非都市土地上的窘境。因此我們優先設定非都市土地為優先舉報標的。',
            ],
          },
        ],
      },
      {
        topic: '我回報完了，然後呢？',
        shouldOpen: false,
        contents: [
          {
            title: '我要怎麼追蹤回報的成效？',
            answers: [
              '請複製該回報圖釘之經緯度，並且透過「搜尋經緯度」功能回到該處查看「案件狀態」是否已變更。如果想進一步了解個案進度，請來信 cet@cet-taiwan.org 詢問。',
              '本系統為協助民眾回報違章資訊之平台，上傳並不代表已經完成舉報。所有回報中，地球公民基金會將優先處理新增建與高污染工廠。2016.05.20之前即營運的低污染違章工廠則持續收集資訊，等待落日期限到期，再行檢舉。',
            ],
          },
          {
            title: '我想要參與更多',
            answers: [
              '地球公民收到回報資訊後，會正式寄送舉報公文至縣市政府，並電話追蹤公文的進度，以確保大家費力回報的農地違章工廠得以拆除。持續分享相關資訊，讓更多人知道這個系統就可以讓政府不敢怠慢。因此，歡迎追蹤地球公民基金會的<a href="https://www.facebook.com/CitizenoftheEarth" target="_blank" rel="noopener">臉書</a>，並分享相關貼文（如每月違章工廠月報）。',
              '另外，我們也需要志工們一起協助整理文件、檢查公文、電話追蹤與其他行動，歡迎您一起<a href="https://www.cet-taiwan.org/civicrm/profile/create?gid=11&reset=1" target="_blank" rel="noopener">加入監督行列</a>。',
              '如果想加入網站協作，歡迎進入此<a href="https://beta.hackfoldr.org/Disfactory/" target="_blank" rel="noopener">協作入口</a>。',
            ],
          },
        ],
      },
      {
        topic: '其他',
        shouldOpen: false,
        contents: [
          {
            title: '我的合法工廠被回報為違章，請問如何澄清？',
            answers: [
              '請記住該圖釘之工廠編號，並電洽地球公民基金會（02-23920371），請求撤下照片。',
            ],
          },
        ],
      },
    ])

    function toggleQuestion(idx) {
      questions[idx].shouldOpen = !questions[idx].shouldOpen
    }

    return {
      questions,

      toggleQuestion,
    }
  },
}
</script>

<style lang="scss" scoped>
.asked-questions {
  padding: 40px 24px;
  background-color: #fbfdf0;
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
  max-width: 800px;
  margin: 0 auto;
}

.question + .question {
  margin-top: 16px;
}

h3,
h4 {
  font-weight: 700;
}

::v-deep a {
  color: #457287;
  border-bottom: 1px solid #457287;

  &:hover,
  &:active {
    color: #2b4754;
    border-color: #2b4754;
  }

  &:visited {
    color: #606060;
    border-color: #606060;
  }
}

.topic {
  background-color: #eaf3bf;
  border-radius: 8px;
  color: #697f01;
  font-size: 26px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  @include media-breakpoint-up(lg) {
    font-size: 30px;
  }
}

.toggle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #697f01;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
  flex-shrink: 0;
  @include media-breakpoint-up(lg) {
    margin-right: 20px;
  }
}

.content {
  display: flex;
  align-items: flex-start;
  margin-top: 40px;
  font-size: 17px;

  &:first-child {
    margin-top: 32px;
  }

  &:last-child {
    margin-bottom: 32px;
  }

  p + p {
    margin-top: 25px;
  }
}

.q {
  background-color: #eaf3bf;
  width: 45px;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  flex-shrink: 0;
  margin-right: 24px;
}

h4 {
  font-size: 22px;
  margin-bottom: 4px;
}
</style>
