var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var path    = require("path");
var fs   = require("fs");
var multer  = require('multer'); //mutipart form data
var upload = multer({ dest: 'uploads/' })
var controlleurTrucks = require('./api/trucks')
var controlleurTruck = require('./api/truck')
var controlleurOrders = require('./api/orders')
var controlleurClients = require('./api/clients')
var controlleurAccount = require('./api/createAccount')

var app = express();
var server = http.createServer(app);
server.listen(port);

app.use(express.static(__dirname));//to get also css, js,...
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.text()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/client/index.html'));
});

app.get('/api/trucks', function(req, res) {
	controlleurTrucks.trucks(req, res, function(err, response){
		if(!err){
			res.header('Content-type','application/json');
			res.header('Charset','utf8');
			res.send(JSON.stringify(response));
		}
	});
});

app.get('/api/orders', function(req, res) {
	controlleurOrders.orders(req, res, function(err, response){
		if(!err){
			res.header('Content-type','application/json');
			res.header('Charset','utf8');
			res.send(JSON.stringify(response));
		}
	});
});

app.get('/api/truck/:id/menu', function(req, res) {
	var id = req.params.id;
	controlleurTruck.truck(req, res, id, function(err, response){
		if(!err){
			res.header('Content-type','application/json');
			res.header('Charset','utf8');
			res.send(JSON.stringify(response));
		}
	});
});

app.post('/api/truck/:id/order', function(req, res) {
	var id = req.params.id;
	controlleurTruck.truck(req, res, id, function(err, response){
		if(!err){
			res.header('Content-type','application/json');
			res.header('Charset','utf8');
			res.send(JSON.stringify(response));
		}
	});
});

app.post('/api/login', function(req, res) {
	var id = req.params.id;
	controlleurClients.client(req, res, function(err, response){
		if(!err){
			res.header('Content-type','application/json');
			res.header('Charset','utf8');
			res.send(JSON.stringify(response));
		}else{
			res.header('Content-type','application/json');
			res.header('Charset','utf8');
			res.status(401).send(JSON.stringify(response));
		}
	});
});

app.post('/api/createAccount', function(req, res) {
	var id = req.params.id;
	controlleurAccount.account(req, res, function(err, response){
		if(!err){
			res.header('Content-type','application/json');
			res.header('Charset','utf8');
			res.send(JSON.stringify(response));
		}else{
			res.header('Content-type','application/json');
			res.header('Charset','utf8');
			res.status(409).send(JSON.stringify(response));
		}
	});
});