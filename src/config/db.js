const { Pool } = require('pg');
const config = require('./config');

// Load env files
require('dotenv').config(); 

if (process.env.NODE_ENV === 'test') {
  require('dotenv').config({path: '.env.test'}) 
}

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




// Rest of db code