
fm.isConcatinated = true; 
 fm.version=1352908462176;
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
fm.Package("com.registration");
fm.Import("jfm.cache.Cache");
fm.Import("jfm.html.form.Text");
fm.Import("jfm.html.Combobox");
fm.Import("jfm.html.FormManager");
fm.Class("Registration", "jfm.html.Container");
com.registration.Registration = function (base, me, Cache, Text, Combobox, FormManager, Container){this.setMe=function(_me){me=_me;};

	var r;
	Static.main = function( args ) {
		r = new me();
		this.onHashChange(args[0]);
	};
	
	Static.onHashChange = function(division){
		division.center.reset();
		division.center.add(r);
	};
	
	this.Registration = function() {
		var self = this;
		base();
		self.el.html(Cache.getInstance().getTemplate('intro'));
		FormManager.setData(self.el.find("form")[0], {
			user : {
				email : QueryStr.getQuery("e") ? QueryStr.getQuery("e") : "" 
			}
		});
		
		self.el.find("form").submit(function( ) {
			var data;
			try {
				data = FormManager.getData(this);
			}
			catch (e) {
				alert(e);
				return false;
			}
			Server.getInstance("registration").serviceCall(data);
			return false;
		});
		setTimeout(function( ) {
			jfm.html.form.Text.convertToJfm(self.el.find("input[type='text']"));
		}, 600);
		
	};
};;

 fm.isConcatinated = false;
