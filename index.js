var http = require('./http');

function configCallback( request, config ) {
	config.keepGenerated = true;
}

http.createServer(function (req, res) {

	var max = parseInt( req.url.substring(1), 10 );

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

}, configCallback ).listen(8000);