fm.Package("user");
fm.Class("Testing");
user.Testing = function( me){this.setMe=function(_me){me=_me;};

	Static.main = function(){
		console.log("this.Testing main");
		new me();
	};
	
	this.Testing = function(){
		console.log("this.Testing 2");
	};
};








