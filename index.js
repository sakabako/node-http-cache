var http = require('./http');

function configCallback( request, config ) {
	config.key = parseInt( request.url.substring(1), 10 ) || 10;
	config.maxAge = 5000; // ms
	config.minAge = 0; // ms
	config.keepGenerated = true;
}

function requestCallback( req, res ) {

	res.writeHead(200, {'Content-Type': 'text/plain'});
	
	var max = parseInt( req.url.substring(1), 10 ) || 10;
	var counter = 1;
	
	var interval = setInterval(function() {
		res.write(counter+'\n');
		if (counter === max) {
			res.end('done\n');
			clearInterval( interval );
		}
		counter++;
	}, 1000);
	
}

http.createServer( requestCallback, configCallback ).listen(8000);
