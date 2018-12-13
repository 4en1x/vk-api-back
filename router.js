const Router = require('express').Router;

const users = require('./routes/users.route');
const groups = require('./routes/groups.route');
const friends = require('./routes/friends.route');
const history = require('./routes/history.route');

function init(app) {
  const restRoute = new Router();

  restRoute.use('/users', users);
  restRoute.use('/groups', groups);
  restRoute.use('/friends', friends);
  restRoute.use('/history', history);

  restRoute.use((req, res) => {
    res.status(404).end();
  });

  app.use('/', restRoute);
}

module.exports = {
  init,
};
