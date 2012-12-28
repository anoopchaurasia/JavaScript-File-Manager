


fm.Package("test");
fm.Class("Command", "Base");
test.Command = function (base, me, Base){this.setMe=function(_me){me=_me;};

	var exec;
	var messages, callbacks, mem, starttime, MESSAGE_BACKLOG;
	this.Command = function( ) {
		var sys = require('sys');
		exec = require('child_process').exec;
	};

	this.method = function( req, res ) {
		var path = process.cwd() + "/web/html/command.html";
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

	this.send = function( req, res ) {
		if(req.connection.remoteAddress !== "127.0.0.1" && req.connection.remoteAddress !== "192.168.1.103"){
			console.log(req.connection.remoteAddress);
			var data = {
				result: "",
				command: req.params.text,
				error: {code:req.connection.remoteAddress + " is not Allowed"}
			}
			res.write(JSON.stringify(data));
			res.end();
			return;
		}

		var a = exec(req.params.text, { timeout: 1000} , function(e, resp){
			var data = {
				result: resp,
				command: req.params.text,
				error: e
			}
			res.write(JSON.stringify(data));
			res.end();
		});
	};
};