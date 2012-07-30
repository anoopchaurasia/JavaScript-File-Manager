/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

fm.Package("test");
fm.Import("user.User");
fm.Class("Registration", "Base");
test.Registration = function( base, me, User,  Base){this.setMe=function(_me){me=_me;};

	var pg, client;
	this.method = function( req, res ) {
		var user = new User(JSON.parse(req.params.user));
		console.log(user.toArray());
		client.query("update user1 set (firstname, lastname, companyname, suite, address, phone, comptype, org, fromwhere, verified)=($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) where email='"
		        + user.email + "'", user.toArray(), function( e, b ) {
			console.log(e, b);
		});
		res.writeHead(200, {
			'Content-Type' : 'text/plain'
		});
		res.write('true');
		res.end();
	};
	
	this.getUser = function( req, res ) {
		user.User.getUser(client, req.params.email, function( ) {
			res.writeHead(200, {
				'Content-Type' : 'text/json'
			});
			res.write(JSON.stringify(new user.User(b.rows[0])));
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









