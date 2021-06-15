const knex = require('knex');

const conn = ({username, password}) => knex({
  client: 'oracledb',
  connection: {
    host: '127.0.0.1',
    user: username,
    password,
    database: 'ORCLCDB.localdomain',
    port: 1521
  },
  pool: { min: 0, max: 50 }
});

module.exports = conn;
