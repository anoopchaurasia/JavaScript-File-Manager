/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

fm.Package("com.home");
fm.Import("com.post.Left");
fm.Import("com.post.Top");

fm.Import("jfm.cache.Cache");
fm.Import("jfm.html.form.Text");
fm.Import("jfm.server.Server");
fm.Class("Home", "jfm.html.Container");
com.home.Home = function( ) {
	
	Static.main = function( args ) {
		this.onHashChange(args);
	};
	
	Static.onHashChange = function( args ) {
		new me(args[0], args[1]);
	};
	
	function getServerPostingFor( link, center ) {
		center.reset();
	}
	
	function addToCenter( resp ) {
		for ( var k = 0; k < resp.length; k++) {
			console.log(resp[k]);
		}
	}
	
	this.Home = function( division, user ) {
		base();
		division.center.reset();
		division.center.add(this);
	};
};
