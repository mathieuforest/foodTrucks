var dbconf = require('./../config/dbconf');

module.exports.truck=function (req, res, id, callback){
    switch(req.method){
        case "GET" :
            var requete="SELECT * FROM truckMenu WHERE id=" + id;
            dbconf.connection.execute(requete,function(err, data) {
                if (err) return callback(true);
                callback(false, data);
            });
        break;
    }
}