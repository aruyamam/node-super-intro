const express = require('express'),
      ejs = require('ejs'),

      app = express();

app.engine('ejs', ejs.renderFile);

app.use(express.static('public'));


// ※トップページ
app.get('/', (req, res) => {
  const msg = 'This is Index Page!<br>'
        + 'これは、トップページです。',
        url = '/other?name=taro&pass=yamada';

  res.render('index.ejs', {
    title: 'Index',
    content: msg,
    link: {
      href: url,
      text: '※別のページに移動'
    }
  });
});

// ※otherページ
app.get('/other', (req, res) => {
  const name = req.query.name,
        pass = req.query.pass,
        msg = `あなたの名前は「${name}」<br>パスワードは「${pass}」です。`;

  res.render('index.ejs', {
    title: 'other',
    content: msg,
    link: {
      href: '/',
      text: '※トップに戻る',
    }
  });
});

const server = app.listen(3000, () => {
  console.log('Server is running!');
});
