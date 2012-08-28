fm.Package("com.reader.taskbar");
fm.Import("com.reader.snippet.AllSnippets");
fm.Import("com.reader.article.ArticleManager");
fm.Class("Taskbar", "jfm.html.Container");
com.reader.taskbar.Taskbar = function (base, me, AllSnippets, ArticleManager, Container) {
	this.setMe = function( _me ) {
		me = _me;
	};
	var self;
	var callback, singleton;
	
	Static.getInstance = function( cb ) {
		if (!singleton) {
			singleton = new me(cb);
		}
		return singleton;
	};
	
	Private.Taskbar = function( cb ) {
		callback = cb;
		self = this;
		base({
		    id : "taskbar",
		    height : 50,
		    html : jQuery("#taskbar-template").html()
		});
		com.reader.Reader.getDivision().bottom.add(this);
		$(".controlers .plus", this.el).click(increaseFontSize);
		$(".controlers .minus", this.el).click(decreaseFontSize);
		$(".home a", this.el).click(me.clickHome);
		$(">.news-feed-select a", this.el).click(changeSettings);
		var cont = jQuery("#hidden").html($("#setting-temp").html());
		getData(cont.find("form.news"));
	};
	function increaseFontSize( ) {
		ArticleManager.getInstance().changeFont(+2);
		AllSnippets.getInstance().changeFont(+2);
		return false;
	}
	function decreaseFontSize( ) {
		
		ArticleManager.getInstance().changeFont(-2);
		AllSnippets.getInstance().changeFont(-2);
		return false;
	}
	
	function changeSettings( e ) {
		
		ArticleManager.getInstance().deActive();
		AllSnippets.getInstance().deActive();
		var settingContainer = new Container({
			html:jQuery("#setting-temp").html()
		});
		settingContainer.el.find('form').submit(function(e){
			e.preventDefault();
			getData(this);
			settingContainer.el.remove();
			AllSnippets.getInstance().active();
		});
		com.reader.Reader.getDivision().center.add(settingContainer);
		e.preventDefault();
		return false;
	}
	
	function getData( form ) {
		var arr = $(form).serializeArray();
		AllSnippets.getInstance().clearStoredData();
		for ( var k in arr) {
			com.reader.Reader.parseRSS(arr[k].value, callback, true);
		}
	}
	
	this.clickHome = function( e ) {
		e.preventDefault();
		if (!AllSnippets.getInstance().isActive()) {
			AllSnippets.getInstance().active();
			ArticleManager.getInstance().deActive();
		}
		return false;
	};
};
