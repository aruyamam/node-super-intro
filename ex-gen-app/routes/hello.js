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

router.get('/show', (req, res, next) => {
  const id = req.query.id;
  db.serialize(() => {
    const q = 'select * from mydata where id = ?';
    db.get(q, [id], (err, row) => {
      if (!err) {
        const data = {
          title: 'Hello/show',
          content: 'id = ' + id + ' のレコード：',
          mydata: row,
        };

        res.render('hello/show', data);
      }
    });
  });
});

router.get('/edit', (req, res, next) => {
  const id = req.query.id;
  db.serialize(() => {
    const q = 'select * from mydata where id = ?';
    db.get(q, [id], (err, row) => {
      if (!err) {
        const data = {
          title: 'hello/edit',
          content: 'id = ' + id + '　のレコードを編集',
          mydata: row,
        };

        res.render('hello/edit', data);
      }
    });
  });
});

router.post('/add', (req, res, next) => {
  const nm = req.body.name,
        ml = req.body.mail,
        ag = req.body.age;

  // db.run('insert into mydata (name, mail,age) values (?, ?, ?)', nm, ml, ag);
  res.redirect('/hello');
});

router.post('/edit', (req, res, next) => {
  const id = req.body.id,
        nm = req.body.name,
        ml = req.body.mail,
        ag = req.body.age,
        q = 'update mydata set name = ?, mail = ?, age = ? where id = ?';

  db.run(q, nm, ml, ag, id);
  res.redirect('/hello');
});

module.exports = router;
