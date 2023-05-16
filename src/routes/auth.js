const { verifySignUp } = require("../app/middlewares");
const { authJwt } = require("../app/middlewares");
const express = require('express');
const router = express.Router();
const authController = require('../app/controllers/AuthController');
router.get('/register' , authController.register);
router.get('/login', authController.login);
router.post('/login', authController.handleLogin);
router.post('/refresh', authController.requestRefreshToken);
router.post('/register', authController.signup);
router.post('/logout', authController.logOut);
router.get('/',
    authJwt.verifyToken
,authController.test)   

module.exports = router;
