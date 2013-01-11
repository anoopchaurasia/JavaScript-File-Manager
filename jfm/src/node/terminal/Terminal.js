fm.Package("terminal");
fm.Class("Terminal");
terminal.Terminal = function () {
	var ter;
	this.Terminal = function (socket) {

		console.log("creating Terminal");
		resp = [], resC=0;
		ter = require('child_process').spawn("powershell.exe",["c:\\temp\\helloworld.ps1"]);
		ter.stdout.on('data', function (data) {
			console.log(data.toString('utf-8'));
			socket.emit('result', { result: data.toString('utf-8') });
		});

		ter.stderr.on('data', function (data) {
			console.log(data.toString('utf-8'));
			socket.emit('error', { data: data.toString('utf-8') });
		});

		ter.on('exit', function (code) {
			console.log('child process exited with code ' + code);
		});
		socket.on("command",function(data){
			console.log(data);
			ter.stdin.write(data.command + '\n');
		});
	};
};
