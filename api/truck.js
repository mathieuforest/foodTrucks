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
            var data = JSON.parse(req.body)
            var order = JSON.parse(data.order).reduce((prev, curr)=>{
                if(curr.value !== '')
                    prev = Object.assign(prev, {[curr.name]: curr.value})
                return prev
            }, {});
            var client = JSON.parse(data.client).reduce((prev, curr)=>{
                if(curr.value !== '')
                    prev = Object.assign(prev, {[curr.name]: curr.value})
                return prev
            }, {});

            var newClient="INSERT INTO clients VALUES (?, ?, ?, ?, ?, ?, ?)";
            dbconf.connection.execute(newClient, [client.email, client.first_name, client.last_name, client.address, client.tel],function(err, result) {
                if (err) return callback(true);
                createOrder(result.insertId);
            });

            function createOrder(client_id){
                var newOrder="INSERT INTO orders VALUES (0, ?, ?, ?, ?, ?, 'submitted')";
                dbconf.connection.execute(newOrder, [truck_id, JSON.stringify(order), client_id, client.delivery_pickup],function(err) {
                    if (err) return callback(true);
                    callback(false, {'order_status': 'submitted'});
                });
            }
        break;
    }
}