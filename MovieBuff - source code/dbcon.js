var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'h2s',
  password        : 'password',
  database        : 'database_something'
});
module.exports.pool = pool;
