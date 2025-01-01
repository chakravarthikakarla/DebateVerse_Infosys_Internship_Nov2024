const express = require('express');
const { RegisterValidate, ResetPasswordValidate } = require('../middlewares/AuthValidation');
const {Login, Register, ResetPassword, Verify, ResetRequest, AuthCheck} = require('../controllers/Auth');
const Authroute = express.Router();

Authroute.post('/login', RegisterValidate, Login)
Authroute.post('/register', RegisterValidate, Register);
Authroute.post('/resetpassword',ResetPasswordValidate, ResetPassword);
Authroute.post('/resetrequest', ResetRequest);
Authroute.get('/register/verify', Verify);
Authroute.get('/authcheck', AuthCheck);

module.exports = Authroute;