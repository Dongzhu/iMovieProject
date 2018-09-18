var express = require('express');
var router = express.Router();

const cheerio = require('cheerio')
const rp = require('request-promise')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/get', function(req, res, next) {
  const options = {
    uri: 'https://www.imdb.com/title/tt0944947/',
    transform: body => cheerio.load(body)
  }

  // const $ = rp(options)
  // console.log($('table.cast_list tr.odd, tr.even').length);
  res.render('index', { title: JSON.stringify(rp(options)) });
  // res.render('index', { title: 'Hello' });
});

module.exports = router;
