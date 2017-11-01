var dbconf = require('./../config/dbconf');

module.exports.truck=function (req, res, truck_id, callback){
    switch(req.method){
        case "GET" :
            var requeteDesc="SELECT * FROM foodTrucks WHERE id=" + truck_id;
            var requeteMenu="SELECT * FROM truckMenu WHERE truck_id=" + truck_id;
            
            dbconf.connection.execute(requeteDesc, function(err, descData) {
                if (err) return callback(true);
                dbconf.connection.execute(requeteMenu, function(err, menuData) {
                    if (err) return callback(true);
                    var result = {
                        truck_desc: descData,
                        truck_menu: menuData
                    }
                    callback(false, result);
                });
            }); 
        break;
        case "POST" :
            console.log(req)
            var requeteDesc="SELECT * FROM foodTrucks WHERE id=" + truck_id;
            var requeteMenu="SELECT * FROM truckMenu WHERE truck_id=" + truck_id;
            
            
        break;
    }
}