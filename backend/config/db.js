const mysql = require('mysql2');


const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'gosports_bdd'
});

module.exports = db;