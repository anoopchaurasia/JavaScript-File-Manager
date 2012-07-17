fm.Package("jfm.hash");
fm.Class("HashChange");
jfm.hash.HashChange = function( ) {
	var division;
	
	function onHashChange( hash ) {
		var hash = location.hash.substring(1) || hash;
		switch (hash) {
			case("registration"):{
				fm.Include("com.registration.Registration", division);
				break;
			}
			case ("login"):{
				fm.Include("com.post.Posting",[division, {}]);
				break;
			}
			default: {
				fm.Include("com.home.Home", division);
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
