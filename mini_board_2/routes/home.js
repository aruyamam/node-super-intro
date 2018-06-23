const express = require('express'),
      router = express.Router(),

      knex = require('knex')({
        dialect: 'sqlite3',
        connection: {
          filename: 'board_data.sqlite3',
        },
        useNullAsDefault: true,
      });

const Bookshelf = require('bookshelf')(knex);
Bookshelf.plugin('pagination');

const User = Bookshelf.Model.extend({
  tableName: 'users',
});

const Message = Bookshelf.Model.extend({
  tableName: 'messages',
  hasTimestamps: true,
  user: function () {
    return this.belongsTo(User);
  },
});

router.get('/', (req, res, next) => {
  res.redirect('/');
});

router.get('/:id', (req, res, next) => {
  res.redirect('/home/' + req.params.id + '/1');
});

router.get('/:id/:page', (req, res, next) => {
  const id = req.params.id;
  id *= 1;
  const pg = req.params.page;
  pg *= 1;
  if (pg < 1) { pg = 1; }
  new Message()
    .oderBy('created_at', 'DESC')
    .where('user_id', '=', id)
    .fetchPage({
      page: pg,
      pageSize: 10,
      withRelated: ['user'],
    })
    .then((collection) => {
      const data = {
        title: 'miniBoard',
        login: req.session.login,
        user_id: id,
        collection: collection.toArray(),
        pagination: collection.pagination,
      };
      res.render('home', data);
    })
    .catch((err) => {
      res.status(500)
        .json({
          error: true,
          data: {
            message: err.message,
          },
        });
    });
});

module.exports = router;
