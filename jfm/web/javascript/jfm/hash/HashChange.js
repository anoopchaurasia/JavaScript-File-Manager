fm.Package("jfm.hash");
fm.Class("HashChange");
jfm.hash.HashChange = function( ) {
	var division;
	
	function onHashChange( ) {
		var hash = location.hash.substring(1);
		switch (hash) {
			case("registration"):{
				fm.Include("com.registration.Registration", division);
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
		onHashChange();
	};
};
