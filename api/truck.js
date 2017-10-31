var dbconf = require('./../config/dbconf');

module.exports.truck=function (req, res, callback){
    switch(req.method){
        case "GET" :
            var requete="SELECT * FROM truckMenu WHERE id=1615";
            dbconf.connection.execute(requete,function(err, data) {
                if (err) return callback(true);
                callback(false, data);
            });
        break;
    }
}