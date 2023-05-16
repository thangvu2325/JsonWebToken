const express = require('express');
const router = express.Router();
const apiController = require('../app/controllers/apiController');
router.put('/data' , apiController.handleDataReceive);
  
module.exports = router;
