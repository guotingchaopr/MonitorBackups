var https = require('https'),
	fs = require('fs'),
	urllib = require("url");


var options = {
	key: fs.readFileSync(__dirname+'/privatekey.pem'),
	cert: fs.readFileSync(__dirname+'/certificate.pem')
}


https.createServer(options, function (req, res) {
	var params = urllib.parse(req.url, true);
	console.log(params);
	console.log(params.query.callback);
	var str = params.query.callback + '(' + JSON.stringify("{'httpsTest':'可用'}") + ')'; //jsonp
	res.end(str);
}).listen(8000);
