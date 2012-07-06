/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

fm.Package("const");
fm.Class("Constants");
Constants = function( ) {
	var ip;
	this.init = function( ) {		
		var socket = require("net").createConnection(80, 'www.google.com');
		socket.on('connect', function( ) {
			ip = socket.address().address;
			socket.end();
		});
	};
	
	Static.Const = {
	    port : 8888,
	    userName : "anoop.c@imaginea.com",
	    password : String.fromCharCode.apply(null, ",0x61,0x6e,0x6f,0x6f,0x70,0x53,0x55,0x31,0x36,0x35,0x35".replace(',', '').split(',')),
	};
	
	Static.getIP = function( ) {
		return ip;
	};
};