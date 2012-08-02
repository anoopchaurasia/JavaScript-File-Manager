fm.Package("shop");
fm.Import("lib.google.Map");
fm.Import("shop.SearchLocation");
fm.Class("Register");
shop.Register = function (me, Map, SearchLocation) {
	this.setMe = function( _me ) {
		me = _me;
	};
	
	Static.main = function( args ) {
		new me(args[0]);
	};
	
	this.Register = function( division ) {
		
		var map = new Map(division);
		division.center.reset().add(map);
		new SearchLocation(division, map);
	};
};
