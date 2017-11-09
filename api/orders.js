var dbconf = require('./../config/dbconf');

module.exports.orders=function (req, res, callback){
    switch(req.method){
        case "GET" :
            
            function getOrdersData(){
                return new Promise(function (resolve, reject) {
                    var requeteOrders="SELECT * FROM orders WHERE client_email=" + JSON.stringify(req.query.email);
                    dbconf.connection.execute(requeteOrders, function(err, ordersData) {
                        if (err) return reject(err);
                        resolve(ordersData);
                    });
                });
            }

            function getMenuData(){
                return new Promise(function(resolve, reject) {
                    var requeteMenus="SELECT * FROM menus";
                    dbconf.connection.execute(requeteMenus,function (err, menuData) {
                        if (err) return reject(err);
                        resolve(menuData);
                    });
                });
            }

            function getTruckData(truck_id){
                return new Promise(function(resolve, reject) {
                    var requeteTruck="SELECT * FROM trucks WHERE id=" + truck_id;
                    dbconf.connection.execute(requeteTruck, function (err, truckData) {
                        if (err) return reject(err);
                        resolve(truckData);
                    });
                });
            } 

            function buildOrdersData(ordersData, menuData){
                return new Promise(function(resolve, reject) {
                    var formatedOrdersData = ordersData.map(order=>{
                        var orderObject = JSON.parse(order.order);
                        return {
                            id: order.id,
                            order: Object.keys(orderObject).map(menuItem=>{
                                var itemData = menuData.filter(item => {
                                    if(item.id.toString() === menuItem){
                                        delete item["truck_id"];
                                        item.qty = orderObject[menuItem];
                                        return item;
                                    }
                                })
                                return itemData[0];
                            }),
                            truck_data: getTruckData(order.truck_id).then(truckData=>{
                                console.log(truckData[0])
                                return truckData[0];
                            }),
                            delivery_pickup: order.delivery_pickup,
                            status: order.status
                        }
                    })
                    resolve(formatedOrdersData);
                })    
            }

            var ordersData, menuData; 
            var formatedOrdersData = getOrdersData().then(ordersDataResponse => {
                ordersData = ordersDataResponse
                return getMenuData();
            }).then((menuDataResponse) => {
                menuData = menuDataResponse
                return buildOrdersData(ordersData, menuData);
            }).then(formatedOrdersData => {
                callback(false, formatedOrdersData);
            });



        break;
    }
}