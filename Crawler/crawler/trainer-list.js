const puppeteer = require('puppeteer')

const url = `https://movie.douban.com/tag/#/?sort=U&range=6,10&tags=`

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
  await page.goto(url, {
    waitUntil: 'networkidle2'
  })

  console.log('Begin')
  await sleep(3000)   // 等待3s网页加载结束

  await page.waitForSelector('.more')

  for(let i=0; i<3; i++) {
    await sleep(3000)
    console.log('click more ',i)
    await page.click('.more')
  }

  const result = await page.evaluate(() => {
    var $ = window.$
    var items = $('.list-wp a')
    var links = []

    if (items.length >= 1) {
      items.each((index, item) => {
        let it = $(item)
        let id = it.find('div').data('id')
        let title = it.find('.title').text()
        let rate = Number(it.find('.rate').text())
        let poster = it.find('img').attr('src').replace('s_ratio', 'l_ratio')

        links.push({id, title, rate, poster})
      })
    }
    return links
  })

  browser.close()
  process.send({result})
  process.exit(0)
})()
