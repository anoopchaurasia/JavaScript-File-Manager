/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

fm.Package("com.home");

fm.Import("com.post.Left");
fm.Import("com.post.Top");
fm.Import("lib.google.Map");
fm.Import("jfm.cache.Cache");
fm.Import("jfm.html.form.Text");
fm.Import("jfm.server.Server");
fm.Class("Home", "jfm.html.Container");
com.home.Home = function (base, me, Left, Top, Map, Cache, Text, Server, Container){this.setMe=function(_me){me=_me;};

	
	Static.main = function( args ) {
		this.onHashChange(args);
	};
	
	Static.onHashChange = function( args ) {
		new me(args[0], args[1]);
	};
	
	
	this.Home = function( division, user ) {
		base({
			width : "100%",
			height : "100%"
		});
		division.center.reset();
		division.center.add(this);
		this.add(new Map(division));
	};
};


