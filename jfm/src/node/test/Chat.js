fm.Package("test");
fm.Class("Chat", "Base");
test.Chat = function() {
	var messages, callbacks, mem, starttime, MESSAGE_BACKLOG, sys;

	this.Chat = function() {
		messages = [];
		sys = require("sys");
		callbacks = [];
		mem = process.memoryUsage();
		setInterval(function() {
			mem = process.memoryUsage();
		}, 10 * 1000);
		starttime = (new Date()).getTime();
		MESSAGE_BACKLOG = 200;
	};

	this.method = function(req, res) {

	};

	this.join = function(req, res) {

		var nick = req.params.nick;
		if (nick == null || nick.length == 0) {
			res.writeHead(400, {
				error : "Bad nick."
			});
			return;
		}

		var session = req.sessionM, sess = {};
		sess.sessionId = nick;
		sess.userId = nick;
		res.setHeader('Set-Cookie', "SESSIONID=" + sess.sessionId + "");
		session.add(sess.sessionId, sess);

		// sys.puts("connection: " + nick + "@" + res.connection.remoteAddress);

		appendMessage(session.nick, "join");
		res.write(JSON.stringify({
			id : session.id,
			nick : session.nick,
			rss : mem.rss,
			starttime : starttime
		}));
		res.end();
	};

	this.recieve = function(req, res) {

		var id = req.params.nick;
		var session = req.sessionM.getSession(id);
		var since = parseInt(req.params.since, 10);

		query(since, function(messages) {
			if (session)
				req.sessionM.updateTime(id);
			res.write(JSON.stringify({
				messages : messages,
				rss : mem.rss
			}));
		});
		res.end();
	};

	this.send = function(req, res) {
		var id = req.params.nick;
		var text = req.params.text;

		var session = req.sessionM.getSession(id);
		if (!session || !text) {
			res.writeHead(400, {
				error : "No such session id"
			});
			res.end();
			return;
		}
		console.log(session);
		req.sessionM.updateTime(id);

		appendMessage(session.nick, "msg", text);
		res.write(JSON.stringify({
			rss : mem.rss
		}));
		res.end();
	};

	function query(since, callback) {
		var matching = [];
		for ( var i = 0; i < messages.length; i++) {
			var message = messages[i];
			if (message.timestamp > since)
				matching.push(message)
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

	function appendMessage(nick, type, text) {
		var m = {
			nick : nick,
			type : type // "msg", "join", "part"
			,
			text : text,
			timestamp : (new Date()).getTime()
		};

		switch (type) {
			case "msg":
				sys.puts("<" + nick + "> " + text);
				break;
			case "join":
				sys.puts(nick + " join");
				break;
			case "part":
				sys.puts(nick + " part");
				break;
		}

		messages.push(m);

		while (callbacks.length > 0) {
			callbacks.shift().callback([ m ]);
		}

		while (messages.length > MESSAGE_BACKLOG)
			messages.shift();
	}

};