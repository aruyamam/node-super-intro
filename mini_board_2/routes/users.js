var express = require('express');
var router = express.Router();

var knex = require('knex')({
  dialect: 'sqlite3',
  connection: {
    filename: 'board_data.sqlite3',
  },
  useNullAsDefault: true,
});

var Bookshelf = require('bookshelf')(knex);

var User = Bookshelf.Model.extend({
  tableName: 'users',
});

/* GET users listing. */
router.get('/add', (req, res, next) => {
  const data = {
    title: 'Users/Add',
    form: {
      name    : '',
      password: '',
      comment : '',
    },
    content: '※登録する名前・パスワード・コメントを入力ください。',
  };

  res.render('users/add', data);
});

router.post('/add', (req, res, next) => {
  const request = req,
        response = res;
      
  req
    .check('name', 'NAMEは必ず入力してください。')
    .notEmpty();
  req
    .check('password', 'PASSWORD　必ず入力してください。').notEmpty();
  req
    .getValidationResult()
    .then((result) => {
      if (!result.isEmpty()) {
        const content = '<ul class="error">',
              result_arr = result.array();

        for (let n in result_arr) {
          content += `<li>${result_arr[n].msg}</li>`;
        }
        content += '</ul>';
        const data = {
          title: 'Users/Add',
          content: content,
          form: req.body,
        };
        response.render('users/add', data);
      }
      else {
        request.session.login = null;
        new User(req.body)
          .save()
          .then((model) => {
            response.redirect('/');
          });
      }
    });
});

router.get('/', (req, res, next) => {
  const data = {
    title: 'Users/Login',
    form: {
      name    : '',
      password:  '',
    },
    content: '名前とパスワードを入力してください。',
  };
  res.reder('users/login', data);
});

router.post('/', (req, res, next) => {
  const request = req,
        response = res;

  req
    .check('name', 'NAMEは必ず入力してください。')
    .notEmpty();
  req
    .check('password', 'PASSWORD　必ず入力してください。').notEmpty();
  req
    .getValidationResult()
    .then((result) => {
      if (!result.isEmpty()) {
        const content = '<ul class="error">',
              result_arr = result.array();

        for (let n in result_arr) {
          content += `<li>${result_arr[n].msg}</li>`;
        }
        content += '</ul>';
        const data = {
          title: 'Users/Login',
          content: content,
          form: req.body,
        };
        response.render('users/login', data);
      }
      else {
        const nm = req.body.name,
              pw = req.body.password;

        User.query({
          where: { name: nm },
          andWhere: { password: pw },
        })
        .fetch()
        .then((model) => {
          if (model === null) {
            const data = {
              title: '再入力',
              content: '<p class="error">名前またはパスワードが違います。</p>',
              form: req.body,
            };
            response.render('users/login', data);
          }
          else {
            request.session.login = model.attributes;
            const data = {
              title: 'Users/Login',
              content: '<p>ログインしました！<br>トップページに戻ってメッセージを送信して下さい。</p>',
              form: req.body,
            };
            response.render('users/login', data);
          }
        });
      }
    });
});

module.exports = router;
