var express = require('express');
var router = express.Router();
const authenticationController = require('../controllers/authentication');


router.get('/login',authenticationController.getLogin);

router.get('/register', authenticationController.getRegister);

router.post('/register/password',  authenticationController.getPassword);
//router.get('/register/password',  authenticationController.getPassword);

//router.get('/register/login',  authenticationController.getRegisterLogin);

router.post('/password', authenticationController.postPassword);
//router.get('/register/password/login', authenticationController.postPassword);
router.post('/login',authenticationController.postLogin);

module.exports = router;
