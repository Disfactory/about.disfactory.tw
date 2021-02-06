<template>
  <div class="factory-search">
    <SvgMeat class="meat" />
    <SvgFish class="fish" />

    <SvgTable class="table" />

    <div class="container">
      <div class="wrapper">
        <div class="title">
          <SvgTitle />
        </div>

        <form>
          <fieldset>
            <legend>搜尋我的故鄉：</legend>

            <div class="input-wrapper">
              <input
                v-model.number="form.zipCode"
                type="text"
                placeholder="區號"
              />

              <VueSelect
                v-model="form.city"
                class="v-select--city"
                :options="CITIES"
                placeholder="縣市"
                :searchable="false"
                :clearable="false"
              >
                <template #open-indicator="{ attributes }">
                  <SvgOpenIndicator v-bind="attributes" />
                </template>
              </VueSelect>

              <VueSelect
                v-model="form.town"
                class="v-select--town"
                :options="townsInCity"
                :placeholder="canSelectTown ? '鄉鎮市區' : '---'"
                :disabled="!canSelectTown"
                :searchable="false"
                :clearable="false"
              >
                <template #open-indicator="{ attributes }">
                  <SvgOpenIndicator v-bind="attributes" />
                </template>
              </VueSelect>

              <button type="submit" @click.prevent="search">GO!</button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>

    <SvgTriangle class="triangle" />
  </div>
</template>

<script>
import {
  ref,
  reactive,
  computed,
  watch,
  onBeforeMount,
} from '@vue/composition-api'
import VueSelect from 'vue-select'
import { cities as CITIES, towns as TOWNS } from '~/constants/regions.json'

import SvgTitle from '~/assets/imgs/title.svg?inline'
import SvgMeat from '~/assets/imgs/meat.svg?inline'
import SvgFish from '~/assets/imgs/fish.svg?inline'
import SvgTable from '~/assets/imgs/table.svg?inline'
import SvgOpenIndicator from '~/assets/imgs/open-indicator.svg?inline'
import SvgTriangle from '~/assets/imgs/triangle.svg?inline'

export default {
  name: 'FactorySearch',

  components: {
    VueSelect,

    SvgTitle,
    SvgMeat,
    SvgFish,
    SvgTable,
    SvgOpenIndicator,
    SvgTriangle,
  },

  setup(_, { emit, root, root: { context: ctx } }) {
    const form = reactive({
      zipCode: undefined,
      city: '',
      town: '',
    })
    const townsInCity = computed(() => {
      if (form.city === '') {
        return []
      }

      return Object.keys(TOWNS[CITIES.indexOf(form.city)])
    })
    const canSelectTown = computed(() => {
      return form.city !== ''
    })

    const wasSetFromOtherInputs = ref(false)
    watch([() => form.city, () => form.town], function ([city, town]) {
      if (wasSetFromOtherInputs.value) {
        wasSetFromOtherInputs.value = false

        return
      }

      if (city !== '' && town !== '') {
        const zipCode = TOWNS[CITIES.indexOf(city)][town]

        if (zipCode !== undefined) {
          form.zipCode = zipCode

          wasSetFromOtherInputs.value = true
        } else {
          form.zipCode = undefined
          form.town = ''
        }
      }
    })

    watch(
      () => form.zipCode,
      function (zipCode) {
        if (wasSetFromOtherInputs.value) {
          wasSetFromOtherInputs.value = false

          return
        }

        if (zipCode === undefined) {
          return
        }

        if (zipCode.toString().length !== 3) {
          form.city = ''
          form.town = ''

          return
        }

        for (let i = 0; i < TOWNS.length; i += 1) {
          const townsInCity = TOWNS[i]
          const idxOfTownInCity = Object.values(townsInCity).indexOf(zipCode)

          if (idxOfTownInCity !== -1) {
            form.city = CITIES[i]
            form.town = Object.keys(townsInCity)[idxOfTownInCity]

            wasSetFromOtherInputs.value = true

            return
          }
        }

        form.city = ''
        form.town = ''
      }
    )

    onBeforeMount(function () {
      const { path, params } = root.$route

      if (path !== '/') {
        if (params.name.length > 4) {
          if (params.name.startsWith('南海諸島')) {
            form.city = params.name.slice(0, 4)
            form.town = params.name.slice(4)
          } else {
            form.city = params.name.slice(0, 3)
            form.town = params.name.slice(3)
          }
        } else {
          form.city = params.name
        }
      }

      search()
    })

    async function search() {
      let stats = {
        region: undefined,
        factories: undefined,
        documents: undefined,
      }

      try {
        const doesHaveCity = form.city !== ''

        if (!doesHaveCity) {
          const { factories, documents } = await ctx.$fetchDisfactoryData(
            '/api/statistics/factories'
          )

          stats = {
            region: '全臺灣',
            factories,
            documents,
          }
        } else if (form.town === '') {
          const region = form.city
          const { cities = {} } = await ctx.$fetchDisfactoryData(
            `/api/statistics/factories?townname=${region}`
          )
          const { factories, documents } = cities?.[region] || {}

          stats = {
            region,
            factories,
            documents,
          }
        } else {
          const region = `${form.city}${form.town}`
          const { cities = {} } = await ctx.$fetchDisfactoryData(
            `/api/statistics/factories?townname=${region}`
          )

          const { factories, documents } =
            cities?.[form.city]?.towns?.[form.town] || {}

          stats = {
            region,
            factories,
            documents,
          }
        }

        {
          const newPath = doesHaveCity ? `/region/${stats.region}/` : '/'

          if (newPath !== decodeURIComponent(root.$route.path)) {
            window.history.pushState(null, '', `.${newPath}`)
          }
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
      }

      emit('displayStats', stats)
    }

    return {
      form,
      canSelectTown,
      CITIES,
      townsInCity,

      search,
    }
  },
}
</script>

<style lang="scss">
@import 'vue-select/src/scss/vue-select.scss';
</style>

<style lang="scss" scoped>
.factory-search {
  padding: 34px 16px 28px 16px;
  background-color: #fff3e0;
  z-index: 9;
  @include media-breakpoint-up(sm) {
    padding: 34px 16px 38px 16px;
  }
  @include media-breakpoint-up(md) {
    padding: 60px 0 38px 0;
  }
  @include media-breakpoint-up(xl) {
    padding: 60px 6.8% 38px 0;
    position: relative;
  }
}

.title {
  padding: 0 18px 20px 18px;
  max-width: 333px;
  @include media-breakpoint-up(sm) {
    padding: 0 0 16px 0;
  }

  @include media-breakpoint-up(md) {
    padding: 0 0 40px 0;
  }

  svg {
    width: 100%;
  }
}

.meat,
.fish {
  position: absolute;
  @include media-breakpoint-up(md) {
    display: none;
  }
}

.table {
  display: none;
  @include media-breakpoint-up(md) {
    display: block;
    position: absolute;
    top: -56px;
    left: 0;
    transform: translateX(-50%);
  }
  @include media-breakpoint-up(lg) {
    top: auto;
    bottom: 28px;
    transform: translateX(-72%);
  }
  @include media-breakpoint-up(xl) {
    bottom: 40px;
    transform: translateX(-60%);
  }
  @include media-breakpoint-up(xxl) {
    transform: translateX(-32%);
  }
}

.meat {
  top: 58px;
  left: -27px;
}

.fish {
  top: 2px;
  right: -35px;
}

.container {
  @include media-breakpoint-up(md) {
    padding-left: 24px;
  }
  @include media-breakpoint-up(lg) {
    padding-left: 0;
    margin-left: 116px;
  }
  @include media-breakpoint-up(xl) {
    max-width: 388px;
    margin-left: auto;
  }
}

.wrapper {
  max-width: 388px;
  margin: 0 auto;
}

legend {
  margin-bottom: 10px;
  font-size: 18px;
  @include media-breakpoint-up(sm) {
    margin-bottom: 16px;
  }
}

.input-wrapper {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  > * {
    width: 100%;
    height: 44px;
    box-sizing: border-box;
  }

  button {
    background-color: #457287;
    border: 1px solid #457287;
    border-radius: 44px;
    font-size: 20px;
    color: #fff;
    font-weight: 700;
    max-width: 82px;
    transition: background-color 0.2s, border-color 0.2s;

    &:hover {
      background-color: #2b4754;
      border-color: #2b4754;
    }
  }
}

input,
.v-select {
  margin-right: 6px;
}

input {
  background-color: #fff;
  max-width: 56px;
  border: 1px solid #a1a1a1;
  border-radius: 5px;
  font-size: 16px;
  padding: 10px;

  &::placeholder {
    color: #a1a1a1;
  }
}

.v-select {
  max-width: 100px;
  flex-shrink: 0.8;
  letter-spacing: 0.48px;
}

::v-deep {
  .vs__dropdown-toggle {
    border: 1px solid #a1a1a1;
    border-radius: 5px;
    background-color: #fff;
    height: 100%;
    padding: 0;
  }

  .vs__selected-options {
    padding: 10px 10px 10px 16px;

    input::placeholder {
      color: #a1a1a1;
    }
  }

  .vs__selected,
  .vs__search {
    margin: 0;
    padding: 0;
    border: none;
  }

  .vs__actions {
    position: absolute;
    padding: 9px 6px;
    top: 10px;
    right: 10px;
  }

  .vs__dropdown-menu {
    border-radius: 5px;
    border: 1px solid #a1a1a1;
    border-top: none;
    max-height: 277px; // 32 * 8 + 5 + 32 / 2
    min-width: auto;
  }

  .vs__dropdown-option {
    padding: 5px 16px;
    line-height: 1.4;
    letter-spacing: 0.48px;

    &--highlight {
      background-color: #fa6b62;
    }
  }

  .vs--disabled {
    .vs__search {
      background-color: transparent;
    }

    .vs__actions {
      display: none;
    }
  }
}

.triangle {
  display: none;
  @include media-breakpoint-up(lg) {
    display: block;
    position: absolute;
    top: 0;
    height: 100%;
    width: auto;
    right: 0;
    z-index: -9;
  }
}
</style>
