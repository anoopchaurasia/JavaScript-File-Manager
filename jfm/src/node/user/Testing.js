fm.Package("user");
fm.Class("Testing");
user.Testing = function(){
	Static.main = function(){
		console.log("this.Testing main");
		new me();
	};
	
	this.Testing = function(){
		console.log("this.Testing 2");
	};
};