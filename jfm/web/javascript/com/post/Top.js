fm.Package("com.post");
fm.Import("jfm.cache.Cache");
fm.Import("jfm.html.form.Text");
fm.Class("Top", "jfm.html.Button");
com.post.Top = function() {

	this.Top = function(center) {
		base({
			html : "Post",
			width:40,
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
				setTimeout(function() {
					jfm.html.form.Text.convertToJfm(center.el.find("input[type='text']"));
				}, 100);
			});
		});
	};
};