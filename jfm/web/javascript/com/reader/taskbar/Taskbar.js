fm.Package("com.reader.taskbar");
fm.Import("com.reader.snippet.AllSnippets");
fm.Import("com.reader.article.ArticleManager");
fm.Import("com.reader.settings.Settings");
fm.Class("Taskbar", "jfm.html.Container");
com.reader.taskbar.Taskbar = function (base, me, AllSnippets, ArticleManager, Settings, Container) {
	this.setMe = function( _me ) {
		me = _me;
	};
	var callback, singleton;
	
	Static.getInstance = function( cb ) {
		if (!singleton) {
			singleton = new me(cb);
		}
		return singleton;
	};
	
	Private.Taskbar = function( cb ) {
		callback = cb;
		if (window.WinJS) {
			WinJS.UI.Pages.define("default.html");
		}
		else {
			base({
			    id : "taskbar",
			    height : 40,
			    html : jQuery("#taskbar-template").html()
			});
			com.reader.Reader.getDivision().bottom.add(this);
		}
		com.reader.Reader.getDivision().center.add(Settings.getInstance());
		Settings.getInstance().disable();
		jQuery("#fontplus").click(increaseFontSize);
		jQuery("#home").click(this.clickHome);
		jQuery("#fontminus").click(decreaseFontSize);
		jQuery("#setting").click(changeSettings);
		Settings.getInstance().getSelectedUrl(function( url ) {
			getData(url);
		});
	};
	function increaseFontSize( e ) {
		e.preventDefault();
		ArticleManager.getInstance().changeFont(+2);
		AllSnippets.getInstance().changeFont(+2);
		return false;
	}
	function decreaseFontSize( e ) {
		// alert("a");
		e.preventDefault();
		ArticleManager.getInstance().changeFont(-2);
		AllSnippets.getInstance().changeFont(-2);
		return false;
	}
	
	function changeSettings( e ) {
		
		ArticleManager.getInstance().deActive();
		AllSnippets.getInstance().deActive();
		Settings.getInstance().enable();
		Settings.getInstance().changeSettings(function( url ) {
			Settings.getInstance().disable();
			AllSnippets.getInstance().active();
			getData(url);
		});
		return false;
	}
	
	function getData( url ) {
		AllSnippets.getInstance().clearStoredData();
		com.reader.Reader.parseRSS(url, callback, true);
	}
	
	this.clickHome = function( e ) {
		e.preventDefault();
		if (!AllSnippets.getInstance().isActive()) {
			ArticleManager.getInstance().deActive();
			AllSnippets.getInstance().active();
		}
		return false;
	};
};
