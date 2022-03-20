const Joi = require('joi');
const User = require('../schemas/user');

const userExists = (req, res, next) => {
  User.exists({ username: req.body.username }, (err, doc) => {
    if (err || doc === null) {
      res.status(404).json({ msg: `L'utilisateur que auquel vous tentez de vous connecter n'existe pas` }).end();
    } else {
      next();
    }
  });
};

const userDoesntExist = (req, res, next) => {
  User.exists({ username: req.body.username }, (err, doc) => {
    if (doc === null) {
      next();
    } else {
      res.status(403).json({ msg: `Un utilisateur avec ce nom existe déjà` }).end();
    }
  });
};

const loginIsValid = (req, res, next) => {
  const userLoginSchema = Joi.object({
    username: Joi.string().alphanum().min(2).max(50).required(),
    password: Joi.string()
  });

  const result = userLoginSchema.validate(req.body);

  if (result.error) {
    res.status(400).json({ msg: `Les informations de connexion que vous avez fournie ne sont pas valides` }).end();
  } else {
    next();
  }
};

const registerIsValid = (req, res, next) => {
  const userRegisterSchema = Joi.object({
    username: Joi.string().alphanum().min(2).max(50).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    passwordRepeat: Joi.ref('password'),
  });

  const result = userRegisterSchema.validate(req.body);

  if (result.error) {
    res.status(400).json({ msg: `Les informations d'inscription que vous avez fournie ne sont pas valides` }).end();
  } else {
    next();
  }
};

const isAnon = (req, res, next) => {
  if (req.user) {
    res.status(403).json({ msg: `Vous devez vous déconnecter pour effectuer l'action demandé` }).end();
  } else {
    next();
  }
};

const isConnected = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ msg: `Vous devez être connecté pour effectuer l'action demandé` }).end();
  } else {
    next();
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 2) {
    res.status(403).json({ msg: `Vous devez être connecté en tant qu'administrateur pour effectuer l'action demandé` }).end();
  } else {
    next();
  }
}

module.exports = {
  userExists,
  userDoesntExist,
  loginIsValid,
  registerIsValid,
  isAnon,
  isConnected,
  isAdmin,
}