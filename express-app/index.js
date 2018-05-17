const express    = require('express'),
      ejs        = require('ejs'),
      bodyParser = require('body-parser'),

      app        = express();

app.engine('ejs', ejs.renderFile);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

// ※トップページ
app.get('/', (req, res) => {
  const msg = 'This is Index Page!<br>'
        + '※メッセージを書いて送信してください。';

  res.render('index.ejs', {
    title: 'Index',
    content: msg,
  });
});

// ※POST送信の処理
app.post('/', (req, res) => {
  const msg = `This is Posted Page!<br>あなたは「<b>${req.body.message}</b>」と送信しました。`

  res.render('index.ejs', {
    title: 'Posted',
    content: msg,
  });
});

const server = app.listen(3000, () => {
  console.log('Server is running!');
});
