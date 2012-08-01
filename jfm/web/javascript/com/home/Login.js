/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

fm.Package("com.home");
fm.Import("jfm.cache.Cache");
fm.Import("jfm.html.FormManager");
fm.Import("jfm.html.form.Text");
fm.Class("Login", "jfm.html.Container");
com.home.Login = function (base, me, Cache, FormManager, Text, Container){this.setMe=function(_me){me=_me;};

	var h;
	Static.main = function( args  ) {
		h = new me(args[0]);
		this.onHashChange(args[0]);
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
				location.hash = 'chat';
			});
			return false;
		});
		setTimeout(function( ) {
			jfm.html.form.Text.convertToJfm(self.el.find("input[type='text']"));
		});
	};
};


