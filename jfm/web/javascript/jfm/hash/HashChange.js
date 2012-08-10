fm.Package("jfm.hash");
fm.Class("HashChange");
jfm.hash.HashChange = function (me){this.setMe=function(_me){me=_me;};
	var division;
	function onHashChange(  ) {
		var hash = location.hash.substring(1);
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
					com.home.Home.onHashChange(division, {});
				}else{
					fm.Include("com.home.Home",division, {});
				}
				break;
			}
			case ("chat"):{
				if(fm.isExist("com.chat.Chat")){
					com.chat.Chat.onHashChange(division, {});
				}else{
					fm.Include("com.chat.Chat",division, {});
				}
				break;
			}
			case ("register"):{
				if(fm.isExist('shop.Register') ){
		    		 shop.Register.hashChange(division);
		    	}
		    	else{
		    		fm.Include("shop.Register", division);
		    		
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
			
			//location.reload();
		}
	}
	
	this.HashChange = function( d ) {
		division = d;
		console.log("a");
		jQuery(window).hashchange(onHashChange);
		if(location.hash.length < 2){
			location.hash="home";
		}
		else{
			onHashChange();
		}
	};
};


