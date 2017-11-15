var dbconf = require('./../config/dbconf');

module.exports.orders=function (req, res, callback){
    switch(req.method){
        case "GET" :
            
            function getOrdersData(){
                return new Promise(function (resolve, reject) {
                    var requeteOrders="SELECT * FROM orders WHERE client_email=" + JSON.stringify(req.query.email) + " ORDER BY date DESC";
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
                return new Promise(async function(resolve, reject) {
                    var formatedOrdersData = await Promise.all(ordersData.map(async (order)=>{
                        if(order.order.length > 0){
                            var orderObject = JSON.parse(order.order);
                        } else {
                            var orderObject = {};
                        }    
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
                            truck_data: await getTruckData(order.truck_id),
                            delivery_pickup: order.delivery_pickup,
                            status: order.status,
                            date: order.date
                        }
                    })).catch(err => {
                        console.log(err)
                    })
                    resolve(formatedOrdersData);
                }).catch(err => {
                    console.log(err)
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
            }).catch(err=>{
                console.log(err)
            });

        break;
    }
}