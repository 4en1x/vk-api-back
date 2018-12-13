const Bluebird = require('bluebird');
const DEFAULT_CONNECTION = Bluebird.promisifyAll(require('../connection/connect'));


class UsersDAO {
  constructor(connection) {
    this.tableName = 'user';
    this.idField = 'id';
    this.connection = connection || DEFAULT_CONNECTION;
  }


  static get instance() {
    return UsersDAO._instance || (UsersDAO._instance = new UsersDAO());
  }

  async update(user, id) {
    try {
      await this.connection.queryAsync({
        sql: `UPDATE ${this.tableName}
              SET ?
              WHERE ${this.idField} = ?`,
        values: [user, id],
      });
    } catch (err) {
      throw err;
    }
  }

  async findByEmailAndPassword(email, password) {
    try {
      const [user] = await this.connection.queryAsync({
        sql: `SELECT * FROM ${this.tableName}
              WHERE email = ? AND password = ?`,
        values: [email, password],
      });

      return user;
    } catch (err) {
      throw err;
    }
  }

  async findByField(fieldName, field) {
    try {
      const [user] = await this.connection.queryAsync({
        sql: `SELECT * FROM ${this.tableName}
              WHERE ${fieldName} = ?`,
        values: [field],
      });

      return user;
    } catch (err) {
      throw err;
    }
  }


  async register(user) {
    try {
      const { insertId } = await this.connection.queryAsync({
        sql: `INSERT INTO ${this.tableName} SET ?`,
        values: [user],
      });

      if (!insertId) {
        throw new Error('500');
      }

      return insertId;
    } catch (err) {
      throw err;
    }
  }

  async findByID(id) {
    try {
      const [user] = await this.connection.queryAsync({
        sql: `SELECT * FROM ${this.tableName}
              WHERE id = ?`,
        values: [id],
      });

      return user;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = UsersDAO;
