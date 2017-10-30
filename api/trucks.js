var fetch = require('node-fetch');

module.exports.trucks=function (req, res, callback){
    switch(req.method){
        case "GET" :
            fetch('https://www.bestfoodtrucks.com/api/events/events/?what=&when=Tomorrow&where=57&toggle=trucks')
            .then(function(res) {
                return res.text();
            }).then(function(body) {
                callback(false, body)
            });
        break;
    }
}