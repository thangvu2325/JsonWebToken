const express = require('express')
const router = express.Router()

const SiteControllers = require('../app/controllers/SiteControllers')

router.get('/search', SiteControllers.search);
router.get('/', SiteControllers.index);

module.exports = router;