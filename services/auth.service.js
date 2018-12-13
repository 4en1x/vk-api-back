const session = require('express-session');
const SQLStore = require('express-mysql-session')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../dao/dao');
const config = require('../config');

const sessionOptions = {
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  checkExpirationInterval: 900000,
  expiration: 86400000,
};

const strategyOptions = {
  usernameField: 'email',
};

function promisifiedAuthenticate(req, res) {
  return new Promise((resolve, reject) => {
    passport.authenticate('local', (err, user) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(user);
    })(req, res);
  });
}

function init(app) {
  passport.use(new LocalStrategy(strategyOptions, async (email, password, done) => {
    try {
      const user = await db.users.findByEmailAndPassword(email, password);
      if (user) {
        return done(null, user);
      }
      return done({ message: '401' }, false);
    } catch (err) {
      return done(err.message);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await db.users.findByID(id);
      if (!user) {
        throw new Error('deserialize-error');
      }
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  app.use(session({
    key: 'sid',
    secret: '53cr3t',
    store: new SQLStore(sessionOptions),
    resave: false,
    saveUninitialized: false,
    rolling: true,
  }));

  app.use(passport.initialize());
  app.use(passport.session());
}

module.exports = {
  init,
  promisifiedAuthenticate,
};
