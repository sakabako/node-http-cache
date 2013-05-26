# node-debounced-io

Some io operations are guaranteed to return the same result. Having more than one of these in progress at any one time serves no purpose. This allows you to create an http server that will cache the result of a request until the request finishes, or for a set time period.

## Basic Usage

It works just like a normal node http server except it takes a configCallback.

```javascript
var http = require('node-debounced-io/http');

function configCallback( req, config ) {
	// config.key === req.url;
	// config.maxAge === 0; // ms
	// config.minAge === 0; // ms
	// config.keepGenerated === false;
}

function requestCallback( req, res ) {

	res.writeHead(200, {'Content-Type': 'text/plain'});
		
	// Count up to max, printing numbers on a new line one second apart.
	var max = parseInt( req.url.substring(1), 10 ) || 10;
	var counter = 1;
	var interval = setInterval(function() {
		res.write(counter+'\n');
		
		if (counter === max) {
			clearInterval( interval );
			res.end('done\n');
		}
		counter++;

	}, 1000);
	
}

http.createServer( requestCallback, configCallback ).listen(8000);

```

## Config Options

The configCallback is called on every request. It is passed a request object and a config object, already populated with defaults. Override what you please.

* `config.key` - the cache key for this request. Defaults to the url, but cookes can be added.
* `config.maxAge` - the cache will be cleared this long after the request completes.
* `config.keepGenerated` - If this is true it will try to maintain a copy of this in the cache.
* `config.minAge` - If keepGenerated is true it will start generating a new copy after this amount of time.

