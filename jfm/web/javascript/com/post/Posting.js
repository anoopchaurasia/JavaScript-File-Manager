fm.Package("com.post");
fm.Import("com.post.Left");
fm.Import("jfm.cache.Cache");
fm.Import("jfm.html.form.Text");
fm.Import("jfm.server.Server");
fm.Class("Posting", "jfm.html.Container");
com.post.Posting = function(){
	
	Static.main = function(args){
		new me(args[0], args[1]);
	};
	
	function getServerPostingFor(link, center){
		Cache.getInstance().getTemplate("post",function(resp){
			center.reset();
			center.add(new Container({html: resp}));
			setTimeout(function(){
				jfm.html.form.Text.convertToJfm(center.el.find("input[type='text']"));
			}, 100);
		});
	}
	
	function addToCenter(resp) {
		for(var k = 0; k< resp.length; k++){
			console.log(resp[k]);
		}
    }
	
	this.Posting = function(division, user){
		base();
		division.center.reset();
		division.center.add(this);
		division.left.add(new Left(function(link){
			getServerPostingFor(link, division.center);
		}));
		
	};
};