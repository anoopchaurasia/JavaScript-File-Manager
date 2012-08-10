fm.Package("shop");
fm.Import("lib.google.Map");
fm.Import("shop.SearchLocation");
fm.Class("Register");
shop.Register = function (me, Map, SearchLocation) {
	this.setMe = function( _me ) {
		me = _me;
	};
	
	var classObj, map, search;
	Static.main = function( args ) {
		classObj = new me(args[0]);
	};
	
	Static.hashChange = function(division){
		classObj.reCreate(division);
	};
	
	this.reCreate = function(division){
		division.center.reset().add(map);
		new SearchLocation(division, map);
	};
	
	this.Register = function( division ) {
		
		map = new Map(division);
		division.center.reset().add(map);
		new SearchLocation(division, map);
	};
};
