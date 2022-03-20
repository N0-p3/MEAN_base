const express = require('express');
const passport = require('passport');
const routerAuth = express.Router();

const mdlAuth = require('../middlewares/mdlAuth');
const ctrlAuth = require('../controllers/ctrlAuth');

routerAuth.route('/auth/login')
  .post(mdlAuth.isAnon, mdlAuth.userExists, mdlAuth.loginIsValid, passport.authenticate('local'), ctrlAuth.login);

routerAuth.route('/auth/logout')
  .get(mdlAuth.isConnected, ctrlAuth.logout);

routerAuth.route('/auth/register')
  .post(mdlAuth.isAnon, mdlAuth.userDoesntExist, mdlAuth.registerIsValid, ctrlAuth.register);

module.exports = routerAuth;