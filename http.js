var CachedResponse = require('./CachedResponse');
var http = require('http');

var caches = {};

function defaultHashingFunction( req ) {
	return req.url;
}
function defaultCacheDurationFunction( req, responseTime ) {
	return 0;
}

exports.createServer = function( callback, hashingFunction, cacheDurationFunction ) {

	hashingFunction = hashingFunction || defaultHashingFunction;
	cacheDurationFunction = cacheDurationFunction || defaultCacheDurationFunction;

	var caches = {};
	
	return http.createServer(function (req, res) {
		var hash = hashingFunction( req );
		
		if (caches[hash]) {
			caches[hash].pipe(res);
			return;
		} else {
			var startTime = new Date();
			caches[hash] = new CachedResponse();
			caches[hash].pipe(res);
			caches[hash].on('end', function() {
				var responseTime = new Date() - startTime;
				setTimeout(function() {
					delete caches[hash];
				}, cacheDurationFunction(req, responseTime) );
			});
		}
		callback( req, caches[hash] );
	});

};