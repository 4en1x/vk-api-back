const service = require('../services/auth.service');
const db = require('../dao/dao');
const config = require('../config');
const axios = require('axios');

async function login(req, res) {
  try {
    if (!req.body.email || !req.body.password) {
      throw new Error('400');
    }

    const user = await service.promisifiedAuthenticate(req, res);

    if (!user) {
      res.status(401).end();
      return;
    }

    req.logIn(user, (error) => {
      if (error) {
        res.status(401).end();
        return;
      }
      res.json({
        username: user.username,
        email: user.email,
      });
    });
  } catch (err) {
    if (err.message === '401') {
      res.status(401).end();
      return;
    }

    if (err.message === '400') {
      res.status(400).end();
      return;
    }

    res.status(500).send(err.message);
  }
}

async function vkToken(req, res) {
  try {
    const { data } = await axios.get(`${config.vk.T_GET_PREFIX}/access_token?client_id=${config.vk.CLIENT_ID}&client_secret=${config.vk.CLIENT_SECRET}&redirect_uri=${config.vk.BLANK}&code=${req.body.code}`);

    const user = {
      vk_id: data.user_id,
      token: data.access_token,
    };

    await db.users.update(user, req.body.id);

    if (data.error) {
      res.status(401).send(data.error.error_msg);
      return;
    }
    res.status(200).end();
  } catch (err) {
    res.status(500).send(err.message);
  }
}

function logout(req, res) {
  if (!req.user) {
    res.status(401).end();
    return;
  }

  req.session.destroy((err) => {
    if (err) {
      res.status(500).end();
      return;
    }

    res.end();
  });
}

async function register(req, res) {
  try {
    let user;
    user = await db.users.findByField('username', req.body.username);

    if (user) {
      res.status(409).send({ error: 'username' });
      return;
    }

    user = await db.users.findByField('email', req.body.email);
    if (user) {
      res.status(409).send({ error: 'email' });
      return;
    }

    const userId = await db.users.register(req.body);

    res.json({
      id: userId,
      redirect: `${config.vk.T_GET_PREFIX}/authorize?client_id=${config.vk.CLIENT_ID}&display=page&redirect_uri=${config.vk.BLANK}&scope=offline,wall,groups&response_type=code&v=${config.vk.V}`,
    });
  } catch (err) {
    res.status(404).end();
  }
}

async function authCheck(req, res, next) {
  if (!req.user) {
    res.status(401).end();
    return;
  }

  next();
}

function getUser(req, res) {
  if (!req.user) {
    res.status(401).end();
    return;
  }

  res.json({ nickname: req.user.nickname, email: req.user.email });
}

module.exports = {
  login,
  logout,
  authCheck,
  getUser,
  register,
  vkToken,
};
