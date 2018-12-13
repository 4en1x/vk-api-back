const mysql = require('mysql');
const config = require('../../config');

const connection = mysql.createConnection(config.db);

connection.connect((err) => {
  if (err) {
    console.error(`Connection error: ${err.stack}`);
    process.exit();
  }
});

connection.on('error', (err) => {
  console.error(`Connection error: ${err.stack}`);
  process.exit();
});

module.exports = connection;
