var http = require('./http');

function hashingFunction( req ) {
	return parseInt(req.url.substr(1), 10) || 20;
}

function cacheDurationFunction( req ) {
	return 15000;
}

http.createServer(function (req, res) {

	var max = hashingFunction( req );

	res.writeHead(200, {'Content-Type': 'text/plain'});
	var times = 1;
	var interval = setInterval(function() {
		res.write(times+'\n');
		if (times === max) {
			res.end('done\n');
			clearInterval( interval );
		}
		times++;
	}, 1000);

	res.write(new Date().toUTCString()+'\n');

}, hashingFunction, cacheDurationFunction).listen(8000);