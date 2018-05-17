const express = require('express'),
      ejs = require('ejs'),

      app = express();

app.engine('ejs', ejs.renderFile);

app.use(express.static('public'));

app.get('/', (req, res) => {
  const msg = 'This is Express Page!<br>'
        + 'これは、スタイルシートを利用した例です。';

  res.render('index.ejs', {
    title: 'Index',
    content: msg
  });
});

const server = app.listen(3000, () => {
  console.log('Server is running');
});
