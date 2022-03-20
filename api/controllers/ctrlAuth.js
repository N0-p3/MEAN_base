const User = require('../schemas/user');
const conf = require('../config');

const login = async (req, res) => {
  res.cookie('session-info', conf.encryptObj({
    isConnected: true,
    role: req.user.role,
  }));
  res.sendStatus(204);
};

const logout = async (req, res) => {
  res.cookie('session-info', conf.encryptObj({
    isConnected: false,
    role: 0,
  }));
  req.logout();

  res.sendStatus(204);
};

const register = async (req, res) => {
  const user = new User();
  user.username = req.body.username;
  user.setPassword(req.body.password);
  user.role = 1;

  try {
    await User.create(user);
    res.sendStatus(204);
  } catch (e) {
    res.sendStatus(500);
  }
};

module.exports = {
  login,
  logout,
  register,
}