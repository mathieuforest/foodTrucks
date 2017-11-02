var fetch = require('node-fetch');
var trucksData = require('./trucks-data.js');

module.exports.trucks=function (req, res, callback){
    switch(req.method){
        case "GET" :
            callback(false, JSON.stringify(trucksData))
        break;
    }
}