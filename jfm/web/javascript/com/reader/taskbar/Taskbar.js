fm.Package("com.reader.taskbar");
fm.Import("com.reader.snippet.AllSnippets");
fm.Import("com.reader.article.ArticleManager");
fm.Import("com.reader.settings.Settings");
fm.Class("Taskbar", "jfm.html.Container");
com.reader.taskbar.Taskbar = function(base, me, AllSnippets, ArticleManager, Settings, Container) {
	this.setMe = function(_me) {
		me = _me;
	};
	var callback, singleton;

	Static.getInstance = function(cb) {
		if (!singleton) {
			singleton = new me(cb);
		}
		return singleton;
	};

	Private.Taskbar = function(cb) {
		callback = cb;
		base({
			id : "taskbar",
			height : 50,
			html : jQuery("#taskbar-template").html()
		});
		com.reader.Reader.getDivision().center.add(Settings.getInstance());
		Settings.getInstance().disable();
		com.reader.Reader.getDivision().bottom.add(this);
		$(".controlers .plus", this.el).click(increaseFontSize);
		$(".controlers .minus", this.el).click(decreaseFontSize);
		$(".home a", this.el).click(me.clickHome);
		$(">.news-feed-select a", this.el).click(changeSettings);
		Settings.getInstance().getSelectedUrl(function(url) {
			getData(url);
		});
	};
	function increaseFontSize(e) {
		e.preventDefault();
		ArticleManager.getInstance().changeFont(+2);
		AllSnippets.getInstance().changeFont(+2);
		return false;
	}
	function decreaseFontSize(e) {
		// alert("a");
		e.preventDefault();
		ArticleManager.getInstance().changeFont(-2);
		AllSnippets.getInstance().changeFont(-2);
		return false;
	}

	function changeSettings(e) {

		ArticleManager.getInstance().deActive();
		AllSnippets.getInstance().deActive();
		Settings.getInstance().enable();
		Settings.getInstance().changeSettings(function(url) {
			getData(url);
			Settings.getInstance().disable();
			AllSnippets.getInstance().active();
		});
		return false;
	}

	function getData(url) {
		AllSnippets.getInstance().clearStoredData();
		com.reader.Reader.parseRSS(url, callback, true);
	}

	this.clickHome = function(e) {
		e.preventDefault();
		if (!AllSnippets.getInstance().isActive()) {
			AllSnippets.getInstance().active();
			ArticleManager.getInstance().deActive();
		}
		return false;
	};
};
