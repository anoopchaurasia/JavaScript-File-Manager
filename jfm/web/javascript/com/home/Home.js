/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

fm.Package("com.home");

fm.Import("com.region.Left");
fm.Import("jfm.cache.Cache");
fm.Import("jfm.html.form.Text");
fm.Import("jfm.server.Server");
fm.Class("Home", "jfm.html.Container");
com.home.Home = function (base, me, Left, Cache, Text, Server, Container){this.setMe=function(_me){me=_me;};
	
	Static.main = function( args ) {
		this.onHashChange(args[0], args[1]);
	};
	
	Static.onHashChange = function( division, args1 ) {
		new me(division, args1);
	};
	
	this.Home = function( division, user ) {
		base({
			width : "100%",
			height : "100%"
		});
		var left = new Left();
		division.left.reset().add(left);
		division.center.reset().add(this);
	};
};


