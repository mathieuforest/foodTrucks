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
            console.log(JSON.parse(req.body))
            var data = JSON.parse(req.body)
            var order = JSON.parse(data.order).reduce(function(prev, curr){
                console.log(prev, curr)
                return [
                    ...prev,
                    {
                        [curr.name]: curr.value
                    }
                ]
            }, []);
            console.log(order)
            var client = data.client;
            var newOrder="INSERT INTO orders VALUES (0, ?, ?, 1, 'submitted')";
            var newClient="INSERT INTO orders VALUES (0, ?, ?, 1, 'submitted')";
            dbconf.connection.execute(newOrder, [truck_id,order],function(err) {
                if (err) return callback(true);
                callback(false, {'order_status': 'submitted'});
            });
        break;
    }
}