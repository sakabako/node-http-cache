var CachedResponse = require('./CachedResponse');
var http = require('http');

var caches = {};

function RequestConfig( request ) {
	
	this.key = request.url;

	this.keepGenerated = false;
	this.minAge = 0;
	this.maxAge = 0;

}

exports.createServer = function( callback, requestConfigCallback ) {

	var complete = {};
	var inProgress = {};

	function populateCache( req, config ) {
		var key = config.key;
		
		if (inProgress[key]) {
			return inProgress[key];
		}
		var cacheObject = inProgress[key] = new CachedResponse();

		cacheObject.on('end', function() {
			complete[key] = cacheObject;
			delete inProgress[key];

			setTimeout(function() {
				if (complete[key] === cacheObject) {
					delete complete[key];
				}
			}, config.maxAge );

			if (config.keepGenerated) {
				setTimeout(function() {
					populateCache( req, config );
				}, config.minAge);
			}
		});
		
		callback( req, cacheObject );

		return cacheObject;
	}
	
	return http.createServer(function (req, res) {
		
		var config = new RequestConfig( req );
		requestConfigCallback( req, config );

		var key = config.key;
		
		if (complete[key]) {
			complete[key].pipe(res);

		} else if (inProgress[key]) {
			inProgress[key].pipe(res);

		} else {
			var cached = populateCache( req, config );
			cached.pipe(res);
			
		}
		
	});

};