import { create as axiosCreate } from 'axios'

const disfactoryApi = axiosCreate({
  baseURL:
    // process.env.NODE_ENV === 'production' ? 'https://api.disfactory.tw/' : '/',
    process.env.NODE_ENV === 'production'
      ? 'https://staging.disfactory.tw/'
      : '/',
})

export default function (_, inject) {
  inject('fetchDisfactoryData', async function (url) {
    const response = (await disfactoryApi.get(url)) || {}

    return response.data || {}
  })
}
