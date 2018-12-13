const Bluebird = require('bluebird');
const DEFAULT_CONNECTION = Bluebird.promisifyAll(require('../connection/connect'));


class SavedUsersDAO {
  constructor(connection) {
    this.tableName = 'saved_user';
    this.idField = 'user_id';
    this.connection = connection || DEFAULT_CONNECTION;
  }


  static get instance() {
    return SavedUsersDAO._instance || (SavedUsersDAO._instance = new SavedUsersDAO());
  }

  async find(userId, page) {
    try {
      return await this.connection.queryAsync({
        sql: `SELECT * FROM ${this.tableName}
              WHERE user_id = ?
              ORDER BY date DESC
              LIMIT ?, ? `,
        values: [userId, (page - 1) * 10, 10],
      });
    } catch (err) {
      throw err;
    }
  }

  async count(userId) {
    try {
      const data = await this.connection.queryAsync({
        sql: `SELECT COUNT(*) as count FROM ${this.tableName}
              WHERE user_id = ?`,
        values: [userId],
      });
      return data[0].count;
    } catch (err) {
      throw err;
    }
  }

  async add(user) {
    try {
      const data = await this.connection.queryAsync({
        sql: `SELECT * FROM ${this.tableName}
              WHERE vk_id = ?`,
        values: [user.vk_id],
      });
      if (data.length > 0) {
        return await this.connection.queryAsync({
          sql: `UPDATE ${this.tableName} SET date = ? WHERE vk_id = ?`,
          values: [user.date, user.vk_id],
        });
      }

      return await this.connection.queryAsync({
        sql: `INSERT INTO ${this.tableName} SET ?`,
        values: [user],
      });
    } catch (err) {
      throw err;
    }
  }
}
module.exports = SavedUsersDAO;
