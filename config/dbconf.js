var mysql = require('mysql2');
var dbconfig = {
        'host' : 'us-cdbr-iron-east-05.cleardb.net',
        'user' : 'b8624f64a5a8f1',
        'password' : '6aaaa6be',
        'database' : 'heroku_073aa83fcab1a66',
        'supportBigNumbers' : true
};
module.exports.dbconfig=dbconfig;
var connection;
connection = mysql.createConnection(dbconfig);
module.exports.connection=connection;