var dbconf = require('./../config/dbconf');

module.exports.truck=function (req, res, truck_id, callback){
    switch(req.method){
        case "GET" :
            var requeteDesc="SELECT * FROM trucks WHERE id=" + truck_id;
            var requeteMenu="SELECT * FROM menus WHERE truck_id=" + truck_id;
            
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
            var order = req.body;
            var newOrder="INSERT INTO orders VALUES (0, ?, ?, 1, 'submitted')";
            dbconf.connection.execute(newOrder, [truck_id,order],function(err) {
                if (err) return callback(true);
                callback(false, {'order_status': 'submitted'});
            });
        break;
    }
}