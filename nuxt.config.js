import REGIONS from './constants/regions.js'
import { SITE_TITLE } from './constants/meta.js'

const { cities: CITIES, towns: TOWNS } = REGIONS
const isProdEnv = process.env.NODE_ENV === 'production'
const SITE_URL = 'https://about.disfactory.tw/'

const SITE_DESCRIPTION =
  '你的回報是行動的開始，有大宗回報，政府才有動起來的壓力'
const metaOg = [
  { hid: 'og:title', property: 'og:title', content: SITE_TITLE },
  {
    hid: 'og:description',
    property: 'og:description',
    content: SITE_DESCRIPTION,
  },
  { hid: 'og:url', property: 'og:url', content: SITE_URL },
  {
    hid: 'og:image:type',
    property: 'og:image:type',
    content: 'image/png',
  },
  {
    hid: 'og:image:width',
    property: 'og:image:width',
    content: '1250',
  },
  {
    hid: 'og:image:height',
    property: 'og:image:height',
    content: '638',
  },
  { hid: 'og:type', property: 'og:type', content: 'website' },
  { hid: 'og:site_name', property: 'og:site_name', content: SITE_TITLE },
  { hid: 'og:locale', property: 'og:locale', content: 'zh_TW' },
]
const metaFb = [
  { hid: 'fb:app_id', property: 'fb:app_id', content: '442237845975385' },
  { hid: 'fb:pages', property: 'fb:pages', content: '148513668543221' },
]
const metaTwitter = [
  { hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
]

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  generate: {
    routes() {
      return isProdEnv
        ? CITIES.concat(
            TOWNS.flatMap((townsInCity, idx) =>
              Object.keys(townsInCity).map((town) => `${CITIES[idx]}${town}`)
            )
          )
            .map((name) => ({ route: `/region/${name}`, payload: { name } }))
            .concat([{ route: '/', payload: { name: '全臺灣' } }])
        : [CITIES[0]]
            .concat(Object.keys(TOWNS[0]).map((town) => `${CITIES[0]}${town}`))
            .map((name) => ({ route: `/region/${name}`, payload: { name } }))
            .concat([{ route: '/', payload: { name: '全臺灣' } }])
    },
  },

  hooks: {
    'vue-renderer': {
      spa: {
        prepareContext({ head, payload }) {
          if (payload) {
            head.meta.push({
              hid: 'og:image',
              property: 'og:image',
              content: `/og-imgs/${payload.name}.png`,
            })
          }
        },
      },
    },
  },

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: SITE_TITLE,
    htmlAttrs: {
      lang: 'zh-Hant',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: SITE_DESCRIPTION,
      },
      ...metaOg,
      ...metaFb,
      ...metaTwitter,
      { name: 'msapplication-TileColor', content: '#da532c' },
      { name: 'theme-color', content: '#fff' },
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      { rel: 'manifest', href: '/site.webmanifest' },
      { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#5bbad5' },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['reset-css/reset.css', '~/assets/css/base.scss'],

  styleResources: {
    scss: ['~/assets/css/_variables.scss', '~/assets/css/mixins/*.scss'],
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['~/plugins/vue-plugins-global.js', '~/plugins/axios.js'],

  proxy: {
    // '/api': isProdEnv
    //   ? 'https://api.disfactory.tw'
    //   : 'https://staging.disfactory.tw',
    '/api': 'https://staging.disfactory.tw',
  },

  googleAnalytics: {
    id: 'UA-154739393-1',
  },

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    // https://github.com/nuxt-community/style-resources-module
    '@nuxtjs/style-resources',
    // https://github.com/nuxt-community/svg-module
    '@nuxtjs/svg',
    // https://github.com/nuxt-community/google-analytics-module
    '@nuxtjs/google-analytics',
  ],

  modules: ['@nuxtjs/proxy'],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend(config) {
      // for @toast-ui/vue-chart
      config.resolve.alias.vue = 'vue/dist/vue.common.js'
    },
  },
}
