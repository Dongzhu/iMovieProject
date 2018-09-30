const puppeteer = require('puppeteer')

const base = `https://movie.douban.com/subject/`
const id = '26996640'
const video = `https://movie.douban.com/trailer/236337/#content`

// 延时函数
const sleep = time => new Promise(resolve =>  {
  setTimeout(resolve, time)
})

;(async () => {
  console.log('Start visit the target page')

  // 创建爬虫
  const browser = await puppeteer.launch({
    executablePath: './chromium/chrome.exe',
    args: ['--no-sanbox'],
    dumpio: false
  })

  const page = await browser.newPage()
  await page.goto(base + id, {
    waitUntil: 'networkidle2'
  })

  await sleep(1000)   // 等待1s网页加载结束

  const result = await page.evaluate(() => {
    var $ = window.$
    var it = $('.related-pic-video')

    if (it && it.length>0 ) {
      var link = it.attr('href')
      var cover = it.attr('style').split('url(')[1].split('?')[0]

      return { link, cover }
    }
    return {}
  })

  let video
  if (result.link) {
    await page.goto(result.link, {
      waitUntil: 'networkidle2'
    })
    await sleep(2000)

    video = await page.evaluate(() => {
      var $ = window.$
      var it = $('source')

      if (it && it.length>0) {
        return it.attr('src')
      }
      return ''
    })
  }

  const data = { video, id, cover: result.cover}

  browser.close()
  // console.log(data)
  process.send(data)
  process.exit(0)
})()
