var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var path    = require("path");
var fs   = require("fs");
var multer  = require('multer'); //mutipart form data
var upload = multer({ dest: 'uploads/' })
var controlleurTrucks = require('./api/trucks')

var app = express();
var server = http.createServer(app);
server.listen(8080);

app.use(express.static(__dirname));//to get also css, js,...
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.text()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/client/index.html'));
});

app.get('/api/trucks', function(req, res) {
	controlleurTrucks.trucks(req,res, function(err, response){
		if(!err){
			res.header('Content-type','application/json');
			res.header('Charset','utf8');
			res.send(JSON.stringify(response));
		}
	});
});
	