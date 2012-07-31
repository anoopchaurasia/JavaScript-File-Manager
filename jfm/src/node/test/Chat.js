fm.Package("test");
fm.Class("Chat", "Base");
test.Chat = function (base, me, Base){this.setMe=function(_me){me=_me;};

	var messages, callbacks, mem, starttime, MESSAGE_BACKLOG;
	
	this.Chat = function( ) {
		messages = [];
		callbacks = [];
		mem = process.memoryUsage();
		setInterval(function( ) {
			mem = process.memoryUsage();
		}, 10 * 1000);
		starttime = (new Date()).getTime();
		MESSAGE_BACKLOG = 100;
		
		setInterval(function( ) {
			var now = new Date();
			while (callbacks.length > 0 && now - callbacks[0].timestamp > 30 * 1000) {
				callbacks.shift().callback([]);
			}
		}, 3000);
	};
	
	this.method = function( req, res ) {
		var path = process.cwd() + "/web/html/chat.html";
		require('fs').readFile(path, function( err, data ) {
			if (err) {
				console.log(err);
			}
			else {
				res.write(data);
				res.end();
			}
		});
	};
	
	this.userExist = function( req, res ) {
		var id = req.cookie.SESSIONID;
		var session = req.sessionM.getSession(id);
		if (session) {
			res.write('1');
		}
		console.log(session);
		res.end();
	};
	
	this.join = function( req, res ) {
		
		var nick = req.params.nick;
		if (nick == null || nick.length == 0) {
			res.writeHead(400, {
				error : "Bad nick."
			});
			return;
		}
		
		var sess = {};
		sess.sessionId = nick;
		sess.userId = nick;
		res.setHeader('Set-Cookie', "SESSIONID=" + sess.sessionId + "");
		req.sessionM.add(sess.sessionId, sess);
		appendMessage(sess.sessionId, "join");
		res.write(JSON.stringify({
		    id : sess.sessionId,
		    nick : sess.sessionId,
		    rss : mem.rss,
		    starttime : starttime
		}));
		res.end();
	};
	
	this.recieve = function( req, res ) {
		
		var id = req.cookie.SESSIONID;
		var session = req.sessionM.getSession(id);
		var since = parseInt(req.params.since, 10);
		
		query(since, function( messages ) {
			if (session)
				req.sessionM.updateTime(id);
			res.write(JSON.stringify({
			    messages : messages,
			    rss : mem.rss,
			    nick : session.SESSIONID
			}));
			res.end();
		});
	};
	
	this.send = function( req, res ) {
		var id = req.cookie.SESSIONID;
		var text = req.params.text;
		var session = req.sessionM.getSession(id);
		if (!session || !text) {
			res.writeHead(400, {
				error : "No such session id"
			});
			res.end();
			return;
		}
		req.sessionM.updateTime(id);
		appendMessage(session.sessionId, "msg", text);
		res.write(JSON.stringify({
			rss : mem.rss
		}));
		res.end();
	};
	
	this.part = function( req, res ) {
		req.sessionM.remove(req.cookie.SESSIONID);
		res.write(JSON.stringify({
			rss : mem.rss
		}));
		res.end();
	};
	
	function query( since, callback ) {
		var matching = [];
		for ( var i = 0; i < messages.length; i++) {
			var message = messages[i];
			if (message.timestamp > since)
				matching.push(message);
		}
		
		if (matching.length != 0) {
			callback(matching);
		}
		else {
			callbacks.push({
			    timestamp : Date.now(),
			    callback : callback
			});
		}
	}
	
	function appendMessage( nick, type, text ) {
		var m = {
		    nick : nick,
		    type : type // "msg", "join", "part"
		    ,
		    text : text,
		    timestamp : (new Date()).getTime()
		};
		messages.push(m);
		while (callbacks.length > 0) {
			callbacks.shift().callback([ m ]);
		}
		
		while (messages.length > MESSAGE_BACKLOG)
			messages.shift();
	}
	
};









