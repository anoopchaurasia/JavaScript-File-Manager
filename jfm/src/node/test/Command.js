fm.Package("test");
fm.Import("terminal.Terminal");
fm.Class("Command", "Base");
test.Command = function (base, me, Terminal, Base){this.setMe=function(_me){me=_me;};

	this.Command = function( ) {
		var io = require('socket.io').listen(global.httpSerrver1);
		io.sockets.on('connection', function (socket) {
			try{

				socket.emit('data', { "result": 'world' });
				new Terminal(socket);
			}catch(e){
				console.error("error: ", e);
			}
		});
	};

	this.method = function( req, res ) {
		var path = process.cwd() + "/jfm/web/html/command.html";
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
};