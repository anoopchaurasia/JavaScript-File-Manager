/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

fm.Package("com.home");
fm.Import("jfm.cache.Cache");
fm.Import("jfm.html.FormManager");
fm.Import("jfm.html.form.Text");
fm.Class("Login", "jfm.html.Container");
com.home.Login = function( ) {
	var h;
	Static.main = function( division ) {
		h = new me(division);
		this.onHashChange(division);
	};
	
	Static.onHashChange = function( division ) {
		division.center.reset();
		division.left.reset();
		division.bottom.reset();
		division.right.reset();
		division.center.add(h);
	};
	
	this.Login = function( division ) {
		var self = this;
		base();
		self.el.html(Cache.getInstance().getTemplate('login'));
		self.el.find("form#signin").submit(function( ) {
			var data;
			try {
				data = FormManager.getData(this);
			}
			catch (e) {
				return false;
			}
			Server.getInstance("Home").serviceCall(data, 'signin', function( resp ) {
				location.hash = resp;
			});
			return false;
		});
		setTimeout(function( ) {
			jfm.html.form.Text.convertToJfm(self.el.find("input[type='text']"));
		});
	};
};