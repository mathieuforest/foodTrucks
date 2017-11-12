var mysql = require('mysql2/promise');
var dbconf = require('./../config/dbconf');

module.exports.client = async function (req, res, callback){

        switch(req.method){
            case "GET" :
                 
            break;
            case "POST" :

                var requeteClient="SELECT * FROM clients WHERE email = " + JSON.stringify(req.body[0].value);
                const clientData = await mysql.createConnection(dbconf.dbconfig).then( async (connection) => { return await connection.execute(requeteClient)});
                if(clientData[0].length === 0){
                    callback(false, 'Courriel introuvable')
                } else if(clientData[0][0].password !== req.body[1].value){
                    callback(false, 'Mauvais mot de passe')
                } else if(clientData[0][0].password === req.body[1].value){
                    callback(false, clientData[0])
                }

            break;
        }

}