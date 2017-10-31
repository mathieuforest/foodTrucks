var mysql = require('mysql2');
var dbconfig = {
        'host' : 'localhost',
        'user' : 'root',
        'password' : '',
        'database' : 'foodTrucks',
        'supportBigNumbers' : true
};
module.exports.dbconfig=dbconfig;
var connection;
connection = mysql.createConnection(dbconfig);
module.exports.connection=connection;
