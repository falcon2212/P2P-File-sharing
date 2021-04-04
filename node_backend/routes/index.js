var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("connection initiated");
  res.json("welcome to node-banckend");
});

module.exports = router;
