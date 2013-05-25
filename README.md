# node-http-cache

This is a simple in-memory http cache, it is meant to solve the problem of two simultaneous requests to the same resource. If two requests come in while a resource is being generated it will only be generated once and sent to all connected clients.

The only cache mechanism is currently simple in memory.

## Basic Usage

It works just like a normal node http server except it takes a configCallback.

```javascript
var http = require('node-cache/http');

function configCallback( request, config ) {
	// config.key === request.url;
	// config.maxAge === 0; // ms
	// config.minAge === 0; // ms
	// config.keepGenerated === false;
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
	
	res.end();

}

http.createServer( requestCallback, configCallback ).listen(8000);

```

## Config Options

The configCallback is called on every request. It is passed a request object and a config object, already populated with defaults. Override what you please.

* `config.key` - the cache key for this request. Defaults to the url, but cookes can be added.
* `config.maxAge` - the cache will be cleared this long after the request completes.
* `config.keepGenerated` - If this is true it will try to maintain a copy of this in the cache.
* `config.minAge` - If keepGenerated is true it will start generating a new copy after this amount of time.

