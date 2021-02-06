const fs = require('fs')
const axios = require('axios')
const { createCanvas, loadImage } = require('canvas')
const imagemin = require('imagemin')
const imageminPngquant = require('imagemin-pngquant')

const { getNumWithCommas } = require('./utils/index.js')

const OG_IMG_SCALE = 2
const baseApiUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://api.disfactory.tw/'
    : 'https://staging.disfactory.tw/'

axios
  .get(
    `${baseApiUrl}api/statistics/factories?townname=${encodeURIComponent(
      '新竹市'
    )}&level=town`
  )
  .then((res) => {
    const { data = {} } = res || {}

    return [
      {
        region: '全臺灣',
        factories: data.factories,
        documents: data.documents,
      },
    ].concat(
      Object.entries(data.cities).flatMap(([city, cityData]) => {
        return [
          {
            region: city,
            factories: cityData.factories,
            documents: cityData.documents,
          },
          ...Object.entries(cityData.towns).map(([town, townData]) => {
            return {
              region: `${city} ${town}`,
              factories: townData.factories,
              documents: townData.documents,
            }
          }),
        ]
      })
    )
  })
  .then(async (data) => {
    const { ctx, canvas, bgImg } = await initOgImg()

    data.forEach((item) => {
      generateOgImg({ ctx, canvas, bgImg }, item)
    })
  })

async function initOgImg() {
  const canvas = createCanvas(500 * OG_IMG_SCALE, 255 * OG_IMG_SCALE)
  const ctx = canvas.getContext('2d')
  const bgImg = await loadImage('./assets/imgs/og-img-bg.png')

  ctx.fillStyle = '#fff'
  ctx.textBaseline = 'top'

  return {
    ctx,
    canvas,
    bgImg,
  }
}

async function generateOgImg(
  { ctx, canvas, bgImg },
  { region, factories, documents }
) {
  const { width: ogImgW, height: ogImgH } = canvas

  ctx.clearRect(0, 0, ogImgW, ogImgH)
  ctx.drawImage(bgImg, 0, 0)

  {
    ctx.font = `600 ${23 * OG_IMG_SCALE}px "PingFang"`
    const text = region
    const { width: textW } = ctx.measureText(text)
    ctx.fillText(text, (ogImgW - textW) / 2, 35 * OG_IMG_SCALE)
  }

  {
    let fctyNumX
    let fctyMeasureX

    switch (factories.toString().length) {
      case 1:
        fctyNumX = 216
        fctyMeasureX = 272
        break
      case 2:
        fctyNumX = 180
        fctyMeasureX = 282
        break
      case 3:
        fctyNumX = 160
        fctyMeasureX = 302
        break
      case 4:
        fctyNumX = 126
        fctyMeasureX = 336
        break
      case 5:
        fctyNumX = 102
        fctyMeasureX = 360
        break
      case 6:
        fctyNumX = 78
        fctyMeasureX = 384
        break
      case 7:
        fctyNumX = 48
        fctyMeasureX = 420
        break
    }

    ctx.font = `700 ${78 * OG_IMG_SCALE}px "Helvetica"`
    ctx.fillText(
      getNumWithCommas(factories),
      fctyNumX * OG_IMG_SCALE,
      82 * OG_IMG_SCALE
    )

    ctx.font = `600 ${42 * OG_IMG_SCALE}px "PingFang"`
    ctx.fillText('間', fctyMeasureX * OG_IMG_SCALE, 94 * OG_IMG_SCALE)
  }

  {
    ctx.font = `500 ${23 * OG_IMG_SCALE}px "PingFang"`
    const text = '疑似農地違章工廠'
    const { width: textW } = ctx.measureText(text)
    ctx.fillText(text, (ogImgW - textW) / 2, 162 * OG_IMG_SCALE)
  }

  {
    ctx.font = `400 ${23 * OG_IMG_SCALE}px "PingFang"`
    const text = `有 ${getNumWithCommas(documents)} 間已被檢舉`
    const { width: textW } = ctx.measureText(text)
    ctx.fillText(text, (ogImgW - textW) / 2, 204 * OG_IMG_SCALE)
  }

  {
    const buffer = await imagemin.buffer(canvas.toBuffer(), {
      plugins: [imageminPngquant()],
    })

    fs.writeFile(
      `./static/og-imgs/${region.replace(' ', '')}.png`,
      buffer,
      function callback(err) {
        if (err) {
          throw err
        }
      }
    )
  }
}
