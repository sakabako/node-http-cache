# node-cache

This is a simple in-memory http cache meant for very high traffic websites. The difference between this cache and others is that the cache starts when the request is made. If two clients request the same page at the same time it will only be generated once.

Right now only `http` is implemented but `fs` is planned.

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
	res.write('hello world');
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

