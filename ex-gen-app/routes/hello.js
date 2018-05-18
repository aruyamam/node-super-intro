const express = require('express'),
      router  = express.Router();

router.get('/', (req, res, next) => {
  const name = req.query.name,
        mail = req.query.mail,
        data = {
          title: 'Hello!',
          content: `あなたの名前は、${name}。<br>メールアドレスは、${mail}です。`,
        };

  res.render('hello', data);
});

module.exports = router;
