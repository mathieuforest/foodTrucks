var dbconf = require('./../config/dbconf');

module.exports.account=function (req, res, callback){
    switch(req.method){
        case "POST" :
            
            var data = JSON.parse(req.body)
            var client = data.reduce((prev, curr)=>{
                if(curr.value !== '')
                    prev = Object.assign(prev, {[curr.name]: curr.value})
                return prev
            }, {});

            var checkIfClientExist = "SELECT * FROM clients WHERE email = " + JSON.stringify(client.email);
            dbconf.connection.execute(checkIfClientExist, function(err, ifClient) {
                if (err) return callback(true);
                if(ifClient.length > 0){
                    return callback(true, [{error: "Le compte est existe déjà."}])
                } else {
                    createClient()
                }
            });

            function createClient(){
                var newClient="INSERT INTO clients VALUES (?, ?, ?, ?, ?, ?)";
                dbconf.connection.execute(newClient, [client.email, client.first_name, client.last_name, client.address, client.tel, client.password],function(err, client) {
                    if (err) return callback(true);
                    clientLogin()
                });
            }

            function clientLogin(){
                var checkIfClientExist = "SELECT * FROM clients WHERE email = " + JSON.stringify(client.email);
                dbconf.connection.execute(checkIfClientExist, function(err, ifClient) {
                    if (err) return callback(true);
                    var response = Object.assign({}, ifClient)
                    delete response.password
                    callback(false, response)
                });
            }

        break;
    }
}