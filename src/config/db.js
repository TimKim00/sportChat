const { Pool } = require('pg');
const config = require('./config');
const pool = new Pool({
  host: config.pg.host,
  user: config.pg.user,
  password: config.pg.password,
  database: config.pg.database,
  port: config.pg.port
});

pool.connect(err => {
  if (err) {
    console.error('connection error', err.stack)
  } else {
    console.log('connected to PostgreSQL database.')
  }
});

module.exports = pool;
