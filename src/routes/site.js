const express = require('express')
const router = express.Router()

const siteControllers = require('../app/controllers/siteControllers')

router.get('/search', siteControllers.search);
router.get('/', siteControllers.index);

module.exports = router;