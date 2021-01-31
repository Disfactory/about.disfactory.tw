<template>
  <div class="banner-join-us">
    <SvgRaiseHand />
    <p class="call">還需要你的加入</p>
    <p class="description">
      你的檢舉就是民意，有大宗回報，政府才有動起來的壓力。
    </p>
  </div>
</template>

<script>
import SvgRaiseHand from '~/assets/imgs/raise-hand.svg?inline'

export default {
  name: 'BannerJoinUs',

  components: {
    SvgRaiseHand,
  },
}
</script>

<style lang="scss" scoped>
.banner-join-us {
  padding: 48px 24px;
  text-align: center;
  background-color: #fff3e0;
  @include media-breakpoint-up(lg) {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 0 0 0;
  }
}

svg {
  width: 75px;
  height: auto;
  margin: 0 0 20px 0;
  @include media-breakpoint-up(lg) {
    width: 93px;
    margin: 0 48px 0 0;
  }
}

.call {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 20px 0;
  @include media-breakpoint-up(lg) {
    margin: 0 56px 0 0;
  }
}

.description {
  font-size: 22px;
  @include media-breakpoint-up(lg) {
    max-width: 354px;
    text-align: left;
  }
}
</style>
