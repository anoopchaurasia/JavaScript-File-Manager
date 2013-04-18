fm.Package("com.newReader.source");
fm.Class("Sources", "jfm.html.DomManager");
com.newReader.source.Sources = function (base, me) {this.setMe=function(_me){me=_me;};
	this.Sources = function () {
		base();
	}

	this.feedList = [ {
			url : "http://feeds.mashable.com/Mashable",
			name : "Mashable"
		}, {
			url : "http://feeds.feedburner.com/fakingnews",
			name : "Faking News",
		}, {
			url : "http://blogs.forbes.com/ewanspence/feed/",
			name : "Ewan Spence"
		}, {
			url : "http://www.engadget.com/editor/brian-heater/rss.xml",
			name : "Engadget"
		}, {
			url : "http://feeds.feedburner.com/liveside",
			name : "liveside"
		}, {
			url : "http://feeds.slashgear.com/slashgear",
			name : "Slashgear"
		}, {
			url : "http://feeds.feedburner.com/TechCrunch/",
			selected : true,
			name : "Tech Crunch"
		} ];
}