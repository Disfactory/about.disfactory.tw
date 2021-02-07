<template>
  <footer>
    <picture>
      <source type="image/webp" srcset="~/assets/imgs/earth-and-g0v.webp" />
      <img src="~/assets/imgs/earth-and-g0v.png" alt="" />
    </picture>

    <div class="containr">
      <p class="contact">聯繫地球公民基金會</p>
      <p>
        Email:
        <a href="https://github.com/Disfactory" target="_blank" rel="noopener"
          >cet@cet-taiwan.org</a
        >
      </p>
      <p>電話：02-23920371</p>
      <p>
        網站：<a
          href="https://github.com/Disfactory"
          target="_blank"
          rel="noopener"
          >https://www.cet-taiwan.org</a
        >
      </p>
    </div>

    <p class="license">
      全站由使用者回報之資料及設計圖以CC
      BY姓名標示4.0釋出，標註「農地違章工廠回報系統貢獻者」，原始碼已MIT開放授權公開在<a
        href="https://github.com/Disfactory"
        target="_blank"
        rel="noopener"
        >GitHub</a
      >上。使用者回報資料未涉及個人資訊部分已整理成開放資料與API。
    </p>
  </footer>
</template>

<script>
export default {
  name: 'TheFooter',
}
</script>

<style lang="scss" scoped>
footer {
  font-size: 18px;
  padding: 40px 0;
  @include media-breakpoint-up(lg) {
    padding: 40px 0 48px 0;
  }
}

img {
  width: 160px;
  margin: 0 auto;
  margin-bottom: 12px;
}

a {
  color: inherit;
  text-decoration: underline;
}

.containr {
  border-top: 1px solid #d9e0a2;
  padding: 32px 32px 0 32px;
  max-width: 376px;
  margin: 0 auto;
  box-sizing: border-box;

  p + p {
    margin-top: 5px;
  }
}

.contact {
  font-weight: 700;
  margin-bottom: 8px;
}

.license {
  text-align: center;
  font-size: 15px;
  color: #a1a1a1;
  margin: 45px auto 0 auto;
  padding: 0 32px;
  max-width: 800px;
}
</style>
