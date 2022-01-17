var express = require('express');
//const {maxAge} = require("express-session/session/cookie");
var router = express.Router();
const apiController = require("../controllers/api");

router.post('/register', apiController.postRegister);

router.get('/image/delete/:imgID', apiController.deleteImage);
router.get('/allImages', apiController.getAllImages);
router.post('/image', apiController.postImage);
router.get('/allImages/delete', apiController.deleteAllImages);


module.exports = router;
