var dbconf = require('./../config/dbconf');

module.exports.orders=function (req, res, callback){
    switch(req.method){
        case "GET" :
            var requeteOrders="SELECT * FROM orders WHERE client_email=" + JSON.stringify(req.query.email);
            dbconf.connection.execute(requeteOrders, function(err, ordersData) {
                if (err) return callback(true);
                getMenu(ordersData)
            });

            function getMenu(ordersData){
                var requeteMenus="SELECT * FROM menus";
                dbconf.connection.execute(requeteMenus, function(err, menu) {
                    if (err) return callback(true);
                    buildOrdersData(menu, ordersData)
                });
            }

            function getTruckData(truck_id) {
                var requeteTruck="SELECT * FROM trucks WHERE id=" + truck_id;
                dbconf.connection.execute(requeteOrders, function(err, truckData) {
                    if (err) return callback(true);
                    return truckData;
                });
            }

            function buildOrdersData(menu, ordersData){
                var formatedOrdersData = ordersData.map(order=>{
                    var orderObject = JSON.parse(order.order);
                    return {
                        id: order.id,
                        order: Object.keys(orderObject).map(menuItem=>{
                            var item = menu.filter(item => {
                                if(item.id === parseFloat(menuItem)){
                                    delete item["truck_id"];
                                    item.qty = orderObject[menuItem];
                                    return item;
                                }
                            })
                            return item[0]
                        }),
                        truck_data: getTruckData(order.truck_id),
                        delivery_pickup: order.delivery_pickup,
                        status: order.status
                    }
                })
                callback(false, formatedOrdersData);
            }
        break;
    }
}