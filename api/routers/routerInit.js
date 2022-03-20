const express = require('express');
const conf = require('../config');
const routerInit = express.Router();

routerInit.route('/init')
  .get(conf.csurfFunc, conf.cookieInit);

module.exports = routerInit;