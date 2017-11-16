var mysql = require('mysql2');
var dbconfig = {
        'host' : 'https://www.cleardb.com/database/details?id=8E5D9977FF74AAB54D9FF79360AF4730',
        'user' : 'b8624f64a5a8f1',
        'password' : '6aaaa6be',
        'database' : 'foodTrucks',
        'supportBigNumbers' : true
};
module.exports.dbconfig=dbconfig;
var connection;
connection = mysql.createConnection(dbconfig);
module.exports.connection=connection;
