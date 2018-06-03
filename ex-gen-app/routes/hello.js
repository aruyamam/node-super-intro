const express = require('express'),
      router  = express.Router(),

      sqlite3 = require('sqlite3'),
      knex = require('knex')({
        dialect: 'sqlite3',
        connection: {
          filename: 'mydb.sqlite3',
        },
        useNullAsDefault: true,
      }),
      Bookshelf = require('bookshelf')(knex),

      MyData = Bookshelf.Model.extend({
        tableName: 'mydata',
      });

const db = new sqlite3.Database('mydb.sqlite3');

// GET
router.get('/', (req, res, next) => {
  new MyData().fetchAll().then((collection) => {
    const data = {
      title: 'Hello!',
      content: collection.toArray(),
    };

    res.render('hello/index', data);
  })
  .catch((err) => {
    res.status(500).json({
      error: true,
      data: {
        message: err.message,
      }
    });
  });
});

router.get('/add', (req, res, next) => {
  const data = {
    title: 'Hello/Add',
    content: '新しいレコードを入力',
    form: {
      name: '',
      mail: '',
      age: 0,
    },
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

router.get('/delete', (req, res, next) => {
  const id = req.query.id;
  db.serialize(() => {
    const q = 'select * from mydata where id = ?';
    db.get(q, [id], (err, row) => {
      if (!err) {
        const data = {
          title: 'Hello/Delete',
          content: 'id = ' + id + '　のレコードを削除',
          mydata: row,
        };

        res.render('hello/delete', data);
      }
    });
  });
});

router.get('/find', (req, res, next) => {
  const data = {
    title  : '/Hello/Find',
    content: '検索IDを入力：',
    form   : { fstr: '' },
    mydata : null,
  };

  res.render('hello/find', data);
});

// POST
router.post('/add', (req, res, next) => {
  const response = res;

  req.check('name', 'NAME は必ず入力してください。').notEmpty();
  req.check('mail', 'MAIL はメールアドレスを記入してください。').isEmail();
  req.check('age', 'AGE は年齢（整数）を入力してください。').isInt();

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      let res = '<ul class="error">';
      const result_arr = result.array();

      for (let n in result_arr) {
        res += `<li>${result_arr[n].msg}</li>`;
      }
      res += '</ul>';

      const data = {
        title: 'Hello/Add',
        content: res,
        form: req.body,
      };

      response.render('hello/add', data);
    }
    else {
      new MyData(req.body)
        .save()
        .then((model) => {
          response.redirect('/hello');
        });
    }
  });

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

router.post('/delete', (req, res, next) => {
  const id = req.body.id,
        q = 'delete from mydata where id = ?';

    db.run(q, id);
    res.redirect('/hello');
});

router.post('/find', (req, res, next) => {
  new MyData()
    .where('id', '=', req.body.fstr)
    .fetch()
    .then((collection) => {
      const data = {
        title: 'Hello!',
        content: '※id = ' + req.body.fstr + ' の検索結果：',
        form: req.body,
        mydata: collection,
      };

      res.render('hello/find', data);
    });
});

module.exports = router;
