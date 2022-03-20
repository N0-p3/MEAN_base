const passport = require('passport');
const localStrategy = require('passport-local');
const mongoStore = require('connect-mongo');
const CryptoJS = require('crypto-js');

// Schemas
const User = require('./schemas/user');
const { AES } = require('crypto-js');

// Constants
const CODE_400_BAD_REQUEST = `Les informations fournies ne sont pas valides`;
const CODE_401_UNAUTHORIZED = `Vous devez être connecté pour effectuer cette action`;
const CODE_403_FORBIDDEN = `Vous n'avez pas l'autorisation d'effectuer la tache demandée`;
const CODE_404_NOT_FOUND = `Le document que vous cherchez n'existe pas`;
const PROJECT_NAME = 'exam';
const IP = 'localhost';
const PORT = 3000;
const STRING_KEY = `oru_)/vsi:%^&OKSPe&!@#']`;
const OBJ_KEY = `e7j56*&B986g7h0(P&H_)j`;

passport.use(new localStrategy(
  (username, password, done) => {
    User.findOne({username: username}, (err, user) => {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.verifyPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
));

passport.serializeUser((user, callback) => {
  callback(null, user._id);
});

passport.deserializeUser((id, callback) => {
  User.findOne({ _id: id }, (err, user) => {
    if (err) { return callback(err); }
    callback(null, user);
  });
});

const csurfFunc = (req, res, next) => {
  res.cookie('XSRF-TOKEN', req.csrfToken(), { httpOnly: false });
  next();
};

const cookieInit = (req, res) => {
  if (req.user) {
    res.cookie('session-info', encryptObj({
      isConnected: true,
      role: req.user.role,
    }));
  } else {
    res.cookie('session-info', encryptObj({
      isConnected: false,
      role: 0,
    }));
  }

  res.sendStatus(204);
};

const encryptString = (s) => {
  return CryptoJS.AES.encrypt(s, STRING_KEY).toString();
};

const encryptObj = (o) => {
  return CryptoJS.AES.encrypt(JSON.stringify(o), OBJ_KEY).toString();
};

const decryptString = (s) => {
  const bytes = CryptoJS.AES.decrypt(s, STRING_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

const decryptObj = (o) => {
  const bytes = CryptoJS.AES.decrypt(o, OBJ_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

const sessionObj = {
  secret: '9y4w7rg0h-3q095jh[0wrst8gbopmsdpn95g8h0q9=er-b]poisinftd[-g3q04ig5]bm-[s0rtiodlnkf',
  resave: false,
  saveUninitialized: true,
  store: mongoStore.create({
    mongoUrl: `mongodb://localhost/${PROJECT_NAME}`,
    collection: 'sessions',
  }),
};

module.exports = {
  CODE_400_BAD_REQUEST,
  CODE_401_UNAUTHORIZED,
  CODE_403_FORBIDDEN,
  CODE_404_NOT_FOUND,
  PROJECT_NAME,
  PORT,
  IP,
  csurfFunc,
  cookieInit,
  encryptString,
  encryptObj,
  decryptString,
  decryptObj,
  sessionObj,
  passport,
};