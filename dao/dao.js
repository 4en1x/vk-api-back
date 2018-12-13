const UsersDAO = require('./impl/users.dao');
const SavedUsersDAO = require('./impl/saved_users.dao');

module.exports = {
  users: UsersDAO.instance,
  saved_users: SavedUsersDAO.instance,
};
