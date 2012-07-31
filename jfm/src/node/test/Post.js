/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

fm.Package("test");
fm.Import("post.Post");
fm.Class("Post", "Base");
test.Post = function (base, me, Post, Base){this.setMe=function(_me){me=_me;};

	var pg, client;
	this.method = function( req, res ) {
		throw("Method is not implemented!");
	};
	
	this.save = function(req, res){
		var p = new post.Post(JSON.parse(req.params.post));
		console.log(p);
		res.end();
	};
	
	this.Post = function( ) {
		pg = require('pg');
		var conString = "tcp://postgres:adminadmin@localhost/postgres";
		client = new pg.Client(conString);
		client.connect();
	};
};









