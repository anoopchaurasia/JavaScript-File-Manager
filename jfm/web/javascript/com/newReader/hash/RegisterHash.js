fm.Package("com.newReader.hash");
fm.Class("RegisterHash","jfm.hash.HashChange");
com.newReader.hash.RegisterHash = function(base, me){this.setMe=function(_me){me=_me};
	this.RegisterHash = function () {
		base();
		this.route =[
			{
				path: "articles",
				controller: "com.newReader.articles.Articles"
			},
			{
				path: "articles/:id",
				controller: "com.newReader.articles.Articles"
			}
		];
	};

	this.onUrlChange = function(url){
		console.log("Found", url);
	};
}