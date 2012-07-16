fm.Package("com.post");
fm.Import("jfm.cache.Cache");
fm.Import("jfm.html.form.Text");
fm.Class("Top", "jfm.html.Button");
com.post.Top = function() {

	this.Top = function(center) {
		base({
			html : "Post",
			'class':'green-btn',
			css : {
				'background-color' : "#ccc",
				"position" : "absolute",
				"right" : "5px"
			}
		});
		
		this.el.click(function(e) {
			Cache.getInstance().getTemplate("post", function(resp) {
				center.reset();
				center.add(new Container({
					html : resp
				}));
				center.el.find("form").submit(function(e){
					e.preventDefault();
					var data = jfm.html.FormManager.getData(this);
					Server.getInstance("post").serviceCall(data,'save');
					return false;
				});
				setTimeout(function() {
					jfm.html.form.Text.convertToJfm(center.el.find("input[type='text']"));
				}, 100);
			});
		});
	};
};