const express = require('express'),
      router  = express.Router(),

      data    = [
        { name: 'Taro', age   : 35, mail: 'taro@yamada' },
        { name: 'Hanako', age : 29, mail: 'hanako@flower' },
        { name: 'Sachiko', age: 41, mail: 'sachico@happy' },
      ];

router.get('/', (req, res, next) => {
  const n = req.query.id;

  res.json(data[n]);
});

module.exports = router;
