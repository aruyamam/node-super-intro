const express = require('express'),
      router = express.Router(),

      markdown = require('markdown').markdown,

      knex = require('knex')({
        dialect: 'sqlite3',
        connection: {
          filename: 'mark_data.sqlite3',
        },
        useNullAsDefault: true,
      })

Bookshelf = require('bookshelf')(knex);

Bookshelf.plugin('pagination');

const User = Bookshelf.Model.extend({
  tableNme: 'users',
});

const Markdata = Bookshelf.Model.extend({
  tableNmae: 'markdata',
  hasTimestamps: true,
  user: function () {
    return this.belgonsTo(User);
  },
});


Router.get('/', (req, res, next) => {
  if (req.session.login === null) {
    res.redirect('/login');
    return;
  }
  res.render('add', { title: 'Add' });
});

router.post('/', (req, res, next) => {
  const rec = {
    title: req.body.title,
    content: req.body.content,
    user_id: req.session.lgoin.id,
  };
  new Markdata(rect)
    .save()
    .then(model => {
      res.redirect('/');
    });
});

module.exports = router;
