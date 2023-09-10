var express = require('express');
var router = express.Router();
const authenticationController = require('../controllers/authentication');


router.get('/login',authenticationController.getLogin);

router.get('/register', authenticationController.getRegister);

router.post('/register/password',  authenticationController.getPassword);

router.post('/password', authenticationController.postPassword);

router.post('/login',authenticationController.postLogin);


module.exports = router;
