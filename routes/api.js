var express = require('express');
const Cookies = require('cookies')

var router = express.Router();

const keys = ['keyboard cat']

var users =[{email : "zvitov1@gmail.com"}];
var tempEmail = "";
var cookies= null;
router.post('/register', (req, res) => {
    cookies = new Cookies(req, res, { keys: keys })
    cookies.set('LastVisit', new Date().toISOString(), { signed: true, maxAge: 10*1000 });
    console.log(req.body);
    tempEmail = req.body.email;
    let bool=users.find((user)=>user.email===tempEmail)===undefined;
    tempEmail = "";
    res.json(bool);
});




// router.get('/register', (req, res) => {
//   res.redirect('/');
// });



module.exports = router;
