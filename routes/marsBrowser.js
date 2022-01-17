var express = require('express');
var router = express.Router();
const marsBrowserController = require("../controllers/marsBrowser");

router.get('/marsBrowser',marsBrowserController.getMarsBrowser);
router.get('/marsBrowser/logout',marsBrowserController.getLogout);

module.exports = router;