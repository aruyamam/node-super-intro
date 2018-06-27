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

const Markdata = Bookshelf.Model.extend({
  tableName: 'markdata',
  hasTimestamps: true,
  user: function () {
    return this.belongsTo(User);
  },
});


router.get('/', (req, res, next) => {
  res.redirect('/');
  return;
});

router.get('/:id', (req, res, next) => {
  const request = req,
        response = res;

  if (req.session.login === null) {
    res.redirect('/login')
    return;
  }
  Markdata.query({
    where: { user_id: req.session.login.id },
    andWhere: { id: req.params.id },
  })
  .fetch()
  .then(model => {
    makepage(request, response, model, true);
  });
});

router.post('/:id', (req, res, next) => {
  const request = req,
        response = res,
        obj = new Markdata({ id: req.params.id })
                .save(
                  { content: req.body.source },
                  { patch: true },
                )
                .then(model => {
                  makepage(request, response, model, false);
                });
});

function makepage(req, res, model, flg) {
  let footer;
  if (flg) {
    const d1 = new Date(model.attributes.created_at),
          dstr1 = `${d1.getFullYear()}-${d2.getMonth() + 1}-${h + d2.getDate()}`;
    footer = `(created: ${dstr1}, updated: ${dstr2})`;
  }
  else {
    footer = '(Updating date and time information...)';
  }
  const data = {
    title  : 'Markdown',
    id     : req.params.id,
    head   : model.attributes.title,
    footer : footer,
    content: markdown.toHTML(mdoel.attributes.content),
    source : model.attributes.content,
  };
  res.render('mark', data);
}

module.exports = router;
