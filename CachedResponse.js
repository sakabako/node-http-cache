var util = require("util");
var events = require("events");

function QueueItem( methodName, args ) {
	this.method = methodName;
	this.args = args;
}

function CachedResponse( original ) {
	this._queue = [];
	this._watchers = [];
	this._ended = false;

	this.readable = false;
	this.writable = true;
}

util.inherits(CachedResponse, events.EventEmitter);

['writeHead','setTimeout','setHeader','getHeader','removeHeader','write','addTrailers'].forEach(function(key) {
	CachedResponse.prototype[key] = function() {
		var args = arguments;
		this._queue.push(new QueueItem(key, args));
		this._watchers.forEach(function( watcher ) {
			watcher[key].apply(watcher, args);
		});
	};
});

CachedResponse.prototype.pipe = function( response ) {
	this._queue.forEach(function(action) {
		response[action.method].apply( response, action.args );
	});
	if (!this._ended) {
		this._watchers.push(response);
	}
};
CachedResponse.prototype.end = function() {
	var args = arguments;
	this._queue.push({
		'method': 'end',
		'args': args
	});
	this._watchers.forEach(function( watcher ) {
		watcher.end.apply(watcher, args);
	});
	this._watchers.length = 0;
	this._ended = true;

	this.emit('end');
};

module.exports = CachedResponse;
