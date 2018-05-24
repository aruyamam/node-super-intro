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

        res.render('hello/index', data);
      }
    });
  });
});

router.get('/add', (req, res, next) => {
  const data = {
    title: 'Hello/Add',
    content: '新しいレコードを入力',
  };

  res.render('hello/add', data);
});

router.post('/add', (req, res, next) => {
  const nm = req.body.name,
        ml = req.body.mail,
        ag = req.body.age;

  // db.run('insert into mydata (name, mail,age) values (?, ?, ?)', nm, ml, ag);
  res.redirect('/hello');
});

module.exports = router;
