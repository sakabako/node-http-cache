var CachedResponse = require('./CachedResponse');
var http = require('http');

var caches = {};

exports.createServer = function( callback, hashingFunction, cacheDurationFunction ) {
	var caches = {};
	
	return http.createServer(function (req, res) {
		var hash = hashingFunction( req );
		
		if (caches[hash]) {
			caches[hash].pipe(res);
			return;
		} else {
			caches[hash] = new CachedResponse();
			caches[hash].pipe(res);
			caches[hash].on('end', function() {
				setTimeout(function() {
					delete caches[hash];
				}, cacheDurationFunction(req) );
			});
		}
		callback( req, caches[hash] );
	});

};