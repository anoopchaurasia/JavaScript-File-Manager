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
com.registration.Registration = function( base, me, Cache, Text, Combobox, FormManager, Container){this.setMe=function(_me){me=_me;};

	var r;
	Static.main = function( division ) {
		r = new me();
		this.onHashChange(division);
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
				email : QueryStr.getQuery("e")
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
			Server.getInstance("registration").serviceCall(data, null, function( resp ) {
			// center.reset();
			// center.add(new Container({
			// html:"You are successfully registered!"
			// }));
			});
			return false;
		});
		var states = new Combobox([], {
		    hintText : "Select State",
		    inputTabIndex : 6
		});
		Cache.getInstance().getTemplate('States', function( data ) {
			states.updateData(jQuery.parseJSON(data));
		});
		states.onChange(function( value, key ) {
			Cache.getInstance().getTemplate(key, "cities", function( data ) {
				city.updateData(jQuery.parseJSON(data), {});
			});
		});
		var city = new Combobox(self.el.find(".city .select select")[0], {
		    hintText : "Select City",
		    inputTabIndex : 7
		});
		self.el.find(".state .select select").hide().after(states.el);
		setTimeout(function( ) {
			jfm.html.form.Text.convertToJfm(self.el.find("input[type='text']"));
		}, 600);
		
	};
};


