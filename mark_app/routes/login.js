const express = require('express'),
      router = express.Router();

const knex = require('knex')({
  dialect: 'sqlite3',
  connection: {
    filename: 'mark_data.sqlite3',
  },
  useNullAsDefault: true,
});

const Bookshelf = require('bookshelf')(knex);

Bookshelf.plugin('pagination');

const User = Bookshelf.Model.extend({
  tableName: 'users',
});


router.get('/', (req, res, next) => {
  const data = {
    title: 'Login',
    form: {
      name: '',
      password: '',
    },
    content: '名前とパスワードを入力ください',
  };
  res.render('login', data);
});

router.post('/', (req, res, next) => {
  const request = req,
        response = res;

  req
    .check('name', 'NAME は必ず入力してください。')
    .notEmpty();
  req
    .check('password', 'PASSWORD は必ず入力してください。')
    .notEmpty();
  req
    .getValidationResult()
    .then(result => {
      if (!result.isEmpty()) {
        let content = '<ul class="error">';
        const result_arr = result.array();
        for (let i in result_arr) {
          content += `<li>${result_arr[n].msg}</li>`;
        }
        content += '</ul>';
        const data = {
          title: 'Login',
          content: content,
          form: req.body,
        };
        response.render('login', data);
      }
      else {
        const nm = req.body.name,
              pw = req.body.password;

        User.query({
          where: { name: nm },
          andWhere: { password: pw },
        })
        .fetch()
        .then(model => {
          if (model === null) {
            const data = {
              title: '再入力',
              content: '<p>名前またはパスワードが違います。</p>',
              form :req.body,
            };
            response.render('login', data);
          }
          else {
            request.session.login = model.attributes;
            const data = {
              title: 'Login',
              content: '<p>ログインしました！<br/>トップページに戻ってメッセージを送信して下さい。</p>',
              form: req.body,
            };
            response.render('login', data);
          }
        });
        
      }
    });
});

module.exports = router;
