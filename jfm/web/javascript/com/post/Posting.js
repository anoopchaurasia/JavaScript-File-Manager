fm.Package("com.post");
fm.Import("com.post.Left");
fm.Import("com.post.Top");
fm.Import("jfm.cache.Cache");
fm.Import("jfm.html.form.Text");
fm.Import("jfm.server.Server");
fm.Class("Posting", "jfm.html.Container");
com.post.Posting = function(){
	
	Static.main = function(args){
		this.onHashChange(args);
	};
	
	Static.onHashChange = function(args){
		new me(args[0], args[1]);
	};

	function getServerPostingFor(link, center){
		center.reset();
	}
	
	function addToCenter(resp) {
		for(var k = 0; k< resp.length; k++){
			console.log(resp[k]);
		}
    }
	
	this.Posting = function(division, user){
		base();
		division.center.reset();
		division.left.add(new Left(function(link){
			getServerPostingFor(link, division.center);
		}));
		division.center.add(this);
		
	};
};