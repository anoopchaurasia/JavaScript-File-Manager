fm.Package("com.newReader.hash");
fm.Clas("RegisterHash");
com.newReader.hash.RegisterHash = function(me){this.setMe=function(_me){me=_me};
	this.RegisterHash = function () {
		this.route=[
			{
				path: "articles",
				controller: com.newReader.articles.Articles
			},
			{
				path: "articles/:id",
				controller: com.newReader.articles.Articles
			}
		];
	};
}