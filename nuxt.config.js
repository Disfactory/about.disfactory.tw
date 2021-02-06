import { cities, towns } from './constants/regions.json'
import { OG_TITLE } from './constants/meta.js'

const isProdEnv = process.env.NODE_ENV === 'production'
const BASE_URL = isProdEnv ? '/about.disfactory.tw/' : '/'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  generate: {
    routes() {
      // return cities
      //   .concat(
      //     towns.flatMap((townsInCity, idx) =>
      //       Object.keys(townsInCity).map((town) => `${cities[idx]}${town}`)
      //     )
      //   )
      //   .map((name) => `/region/${name}`)
      return [cities[4]]
        .concat(Object.keys(towns[4]).map((town) => `${cities[4]}${town}`))
        .map((name) => ({ route: `/region/${name}`, payload: { name } }))
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
              content: `${BASE_URL}og-imgs/${payload.name}.png`,
            })
          }
        },
      },
    },
  },

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  router: {
    base: BASE_URL,
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: OG_TITLE,
    htmlAttrs: {
      lang: 'zh-Hant',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: '你的回報是行動的開始，有大宗回報，政府才有動起來的壓力',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['reset-css/reset.css', '~/assets/css/base.scss'],

  styleResources: {
    scss: ['~/assets/css/_variables.scss', '~/assets/css/mixins/*.scss'],
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['~/plugins/vue-plugins-global.js', '~/plugins/axios.js'],

  proxy: {
    '/api': isProdEnv
      ? 'https://api.disfactory.tw'
      : 'https://staging.disfactory.tw',
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
