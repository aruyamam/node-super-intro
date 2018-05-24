const express = require('express'),
      router  = express.Router(),

      sqlite3 = require('sqlite3');

const db = new sqlite3.Database('mydb.sqlite3');

router.get('/', (req, res, next) => {
  // データベースのシリアライズ
  db.serialize(() => {
    // レコードをすべて取り出す
    db.all('select * from mydata', (err, rows) => {
      // データベース完了時の処理
      if (!err) {
        const data = {
          title: 'Hello!',
          content: rows,
        };

        res.render('hello', data);
      }
    });
  });

});

module.exports = router;
