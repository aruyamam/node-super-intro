const express = require('express'),
      router  = express.Router(),

      http = require('https'),
      parseString = require('xml2js').parseString;

router.get('/', (req, res, next) => {
  const opt = {
    host: 'news.yahoo.co.jp',
    port: 443,
    path: '/pickup/rss.xml',
  };

  http.get(opt, (res2) => {
    let body = '';
    
    res2.on('data', (data) => {
      body += data;
    });

    res2.on('end', () => {
      parseString(body.trim(), (err, result) => {
        const data = {
          title: 'Hello!',
          content: result.rss.channel[0].item,
        };

        res.render('hello', data);
      });
    });
  });
});

module.exports = router;
