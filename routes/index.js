var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  req.session.loginMessage = '';
  //req.session.isLogged = false;
  req.session.save();
  res.redirect('/login');
  //res.render('login', { title: 'the site' });
});

// router.get('/login', function(req, res, next) {
//   //console.log(req.session.registered);
//   res.cookie('ErrorTime', '0');
//   res.render('login', { registered: req.session.registered });
// });
//
// router.get('/register', (req, res) => {
//   console.log(req.cookies?.ErrorTime);
//   res.render('register',{timeError: req.cookies?.ErrorTime});
// });
//
//
// router.get('/register/password', (req, res) => {
//   res.render('password',{email: req.session.email});
// });
//
// router.post('/password', (req, res) => {
//   let thePassword = req.thePassword;
//   //console.log(cookies.LoginProcess);
//   let onTime = req.cookies?.LoginProcess;//cookies.get('LoginProcess', {signed: true});
//   console.log('time: ' + onTime);
//   //onTime ? console.log('yes') : console.log('no');
//   let theEmail = req.session.email;
//   let emailIsFree = users.find((user) => user.email === theEmail) === undefined;
//   console.log('free: ' + emailIsFree);
//   if (onTime && emailIsFree) {
//     users.push({
//       email: theEmail, firsName: req.session.firsName,
//       lastName: req.session.lastName, password: thePassword
//     });
//     req.session.registered = true;
//     res.redirect('/login');
//   } else {
//     if (!onTime) {
//       res.cookie('ErrorTime', '1');
//       res.redirect('/register');
//     }//render('register', {onTime: false});
//     if (!emailIsFree) res.redirect('/register');
//   }
// });
//
//
module.exports = router;
