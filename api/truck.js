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

            var checkIfClientExist = "SELECT * FROM clients WHERE email = " + JSON.stringify(client.email);
            dbconf.connection.execute(checkIfClientExist, function(err, ifClient) {
                if (err) return callback(true);
                if(ifClient.length > 0){
                    createOrder(client.email)
                } else {
                    createClient()
                }
            });

            function createClient(){
                var newClient="INSERT INTO clients VALUES (?, ?, ?, ?, ?)";
                dbconf.connection.execute(newClient, [client.email, client.first_name, client.last_name, client.address, client.tel],function(err) {
                    if (err) return callback(true);             
                    createOrder(client.email);
                });
            }

            function createOrder(client_email){
                var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
                var newOrder="INSERT INTO orders VALUES (0, ?, ?, ?, ?, 'submitted','" + date + "')";
                dbconf.connection.execute(newOrder, [truck_id, JSON.stringify(order), client_email, client.delivery_pickup, ],function(err) {
                    console.log(err)
                    if (err) return callback(true);
                    callback(false, {'order_status': 'submitted'});
                });
            }
        break;
    }
}