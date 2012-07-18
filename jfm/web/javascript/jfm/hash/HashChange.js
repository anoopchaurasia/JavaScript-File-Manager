fm.Package("jfm.hash");
fm.Class("HashChange");
jfm.hash.HashChange = function( ) {
	var division;
	
	function onHashChange( hash ) {
		var hash = location.hash.substring(1) || hash;
		switch (hash) {
			case("registration"):{
				if(isExist("com.registration.Registration")){
					com.registration.Registration.onHashChange(division);
				}else{
					fm.Include("com.registration.Registration", division);
				}
				break;
			}
			case ("home"): {
				if(isExist("com.home.Home")){
					com.home.Home.onHashChange([division, {}]);
				}else{
					fm.Include("com.home.Home",[division, {}]);
				}
				break;
			}
			default: {
				if(isExist("com.home.Login")){
					com.home.Home.onHashChange(division);
				}else{
					fm.Include("com.home.Login", division);
				}
			}
		}
	}
	
	function isExist(cls){
		var s = cls.split(".");
		var o = window;
		for(var k in s){
			if(!o[s[k]]){
				return false;
			}
			o = o[s[k]];
		}
		return true;
	}
	
	this.HashChange = function( d ) {
		division = d;
		console.log("a");
		jQuery(window).hashchange(onHashChange);
		onHashChange ("home");
	};
};
