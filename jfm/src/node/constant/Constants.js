/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

fm.Package("constant");
fm.Class("Constants");
constant.Constants = function (me){this.setMe=function(_me){me=_me;};

	var ip = "localhost";
	this.init = function( ) {		
		var socket = require("net").createConnection(80, 'www.google.com');
		socket.on('connect', function( ) {
			ip = socket.address().address;
			socket.end();
		});
		socket.on("error",function(){
			console.log(arguments);
		});
	};
	
	Static.interVal = 5* 60 * 1000;
	Static.sessionTimeOut = 30 * 60 * 1000;
	
	Static.Const = {
	    port : process.env.PORT || 5000,
	    userName : "anoop.c@imaginea.com",
	    password : String.fromCharCode.apply(null, ",0x61,0x6e,0x6f,0x6f,0x70,0x53,0x55,0x31,0x36,0x35,0x35".replace(',', '').split(',')),
	};
	
	Static.getIP = function( ) {
		return ip;
	};
};








