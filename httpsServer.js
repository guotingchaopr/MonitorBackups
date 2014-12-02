/*
var http = require('http'),
	fs = require('fs'),

*/



var http=require('http'),
	urllib = require("url");
var server=new http.Server();
server.on('request',function(req,res){
   var params = urllib.parse(req.url, true);
		console.log(params);
		console.log(params.query.callback);
		var str = params.query.callback + '(' + JSON.stringify("{'total':'5000'}") + ')'; //jsonp
		res.writeHead(200,{'Content-Type':'text/json'});
		res.end(str);
});

server.listen(3000);
/*http.createServer(function (req, res) {
	var params = urllib.parse(req.url, true);
	console.log(params);
	console.log(params.query.callback);
	var str = params.query.callback + '('+ JSON.stringify("{'total':'5000'}") + ')'; //jsonp
	res.end(str);
}).listen(8000);*/
