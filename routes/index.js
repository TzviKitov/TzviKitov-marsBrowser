var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/login');
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'the site' });
});

router.get('/register', (req, res) => {
  res.render('register',{email: ''});
});


router.get('/password', (req, res) => {
  res.render('password',{email: ''});
});


module.exports = router;
