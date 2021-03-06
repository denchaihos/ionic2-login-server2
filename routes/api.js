var express = require('express');
var router = express.Router();
var jwt = require('../models/jwt')

router.get('/list', function(req, res, next) {
  let db = req.db;
  let token = req.query.token;

  jwt.verify(token)
    .then((decoded) => {
        let sql = `SELECT HOSPCODE, PID, NAME, LNAME FROM tmp_dengue LIMIT 10`;
        db.raw(sql, [])
          .then(rows => {
            res.send({ ok: true, rows: rows[0] });
          })
          .catch(err => {
            res.send({ ok: false, msg: err.message })
          });
    }, err => {
      console.log(err);
      res.send({ok: false, msg: 'Invalid token!'})
    });

});

router.post('/search', function(req, res, next) {
  let db = req.db;
  let token = req.body.token;
  let query = req.body.query;

  jwt.verify(token)
    .then((decoded) => {
      let sql = `SELECT HOSPCODE, PID, NAME, LNAME 
        FROM tmp_dengue
        WHERE NAME LIKE ?
        LIMIT 10`;
      let _query = `${query}%`
        db.raw(sql, [_query])
          .then(rows => {
            res.send({ ok: true, rows: rows[0] });
          })
          .catch(err => {
            res.send({ ok: false, msg: err.message })
          });
    }, err => {
      console.log(err);
      res.send({ok: false, msg: 'Invalid token!'})
    });

});

module.exports = router;
