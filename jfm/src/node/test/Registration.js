/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

fm.Package("test");
fm.Import("user.User");
fm.Class("Registration", "Base");
test.Registration = function (base, me, User, Base){this.setMe=function(_me){me=_me;};

	var pg, client;
	this.method = function(){}; 
	this.getUser = function( req, res ) {
		user.User.getUser(client, req.params.email, function( ) {
			res.writeHead(200, {
				'Content-Type' : 'text/json'
			});
			res.write(JSON.stringify(new user.User(b.rows[0])));
			res.end();
		});
	};
	this.register = function( req, res ) {
		console.log("this.register ");
		var user = new User(JSON.parse(req.params.user));
		user.createUser(client, function(e, b){
			if(e){
				res.write("can not create acount!");
			}
			res.end();
		});
	};
	
	this.Registration = function( ) {
		console.log("Registration ..");
		pg = require('pg');
		var conString = "tcp://postgres:adminadmin@localhost/postgres";
		client = new pg.Client(conString);
		client.connect();
	};
};









