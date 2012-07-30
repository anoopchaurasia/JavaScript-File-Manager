fm.Package("jfm.hash");
fm.Class("HashChange");
jfm.hash.HashChange = function( me){this.setMe=function(_me){me=_me;};

	var division;
	
	function onHashChange( hash ) {
		var hash = location.hash.substring(1) || hash;
		switch (hash) {
			case("registration"):{
				if(fm.isExist("com.registration.Registration")){
					com.registration.Registration.onHashChange(division);
				}else{
					fm.Include("com.registration.Registration", division);
				}
				break;
			}
			case ("home"): {
				if(fm.isExist("com.home.Home")){
					com.home.Home.onHashChange([division, {}]);
				}else{
					fm.Include("com.home.Home",[division, {}]);
				}
				break;
			}
			case ("chat"):{
				if(fm.isExist("com.home.Chat")){
					com.home.Chat.onHashChange([division, {}]);
				}else{
					fm.Include("com.home.Chat",[division, {}]);
				}
				break;
			}
			default: {
				if(fm.isExist("com.home.Login")){
					com.home.Login.onHashChange(division);
				}else{
					fm.Include("com.home.Login", division);
				}
			}
		}
	}
	
	this.HashChange = function( d ) {
		division = d;
		console.log("a");
		jQuery(window).hashchange(onHashChange);
		onHashChange ("home");
	};
};


