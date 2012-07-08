/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

fm.Package("test");
fm.Import("user.User");
fm.Class("Post", "Base");
test.Post = function( ) {
	var pg, client;
	this.method = function( req, res ) {
		throw("Method is not implemented!");
	};
	
	this.save = function(req, res){
		var p = JSON.parse(req.paramas.post);
		
	};
	
	this.Post = function( ) {
		pg = require('pg');
		var conString = "tcp://postgres:adminadmin@localhost/postgres";
		client = new pg.Client(conString);
		client.connect();
	};
};
