fm.Package("com.home");
fm.Class("SubCategory", "jfm.html.Container");
com.home.SubCategory = function( ) {
	var division;
	Static.main = function( args ) {
		division = args[0];
		this.showSubCategory(args[1]);
	};
	
	Static.showSubCategory = function( id ) {
		division.center.reset();
		var sc = new me(id);
		division.center.add(sc);
	};
	
	this.SubCategory = function( id ) {
		base();
		var self = this;
		var id = id.substring(id.indexOf("type=")+5);
		Server.getInstance("subcategory").serviceCall({
			id : id
		}, "getSubCategory", function( resp ) {
			self.el.html(resp);
		}, null, 'html');
	};
};
