fm.Package("com.reader.events");
fm.Import("com.reader.snippet.AllSnippets");
fm.Import("com.reader.article.ArticleManager");
fm.Import("com.reader.taskbar.Taskbar");
fm.Class("Events");
com.reader.events.Events = function( me, AllSnippets, ArticleManager, Taskbar ) {
	this.setMe = function( _me ) {
		me = _me;
	};
	var singleton;
	
	Static.getInstance = function( ) {
		if (!singleton) {
			singleton = new me();
		}
		return singleton;
	};
	
	Private.Events = function( ) {
		this.keyupEvents();
		this.keydownEvents();
	};
	
	this.keyupEvents = function( ) {
		$(document).keyup(function( e ) {
			switch (e.keyCode) {
				case 13: {
					AllSnippets.getInstance().showArticle();
					return false;
				}
				case 36: {
					Taskbar.getInstance().clickHome(e);
					return false;
				}
				case 8: {
					if (ArticleManager.getInstance().isActive()) {
						Taskbar.getInstance().clickHome(e);
						return false;
					}
				}
			}
		});
	};
	
	this.keydownEvents = function( ) {
		var t = [], scrolling = false, scrollv = 0;
		jQuery("#next").click(function( ) {
			scrolling = true;
			AllSnippets.getInstance().next();
			ArticleManager.getInstance().next();
			preventScroll();
			return false;
		});
		jQuery("#prev").click(function( ) {
			scrolling = true;
			AllSnippets.getInstance().prev();
			ArticleManager.getInstance().prev();
			preventScroll();
			return false;
		});
		
		function preventScroll( ) {
			setTimeout(function( ) {
				scrolling = false;
			}, 400);
		}
		if (navigator.userAgent.indexOf("Phone") != -1 && navigator.userAgent.indexOf("IE") != -1) {
			com.reader.Reader.getDivision().center.el.css("overflow", "auto");
			com.reader.Reader.getDivision().center.el.scroll(function( e ) {
				e.preventDefault();
				if (scrolling) {
					return false;
				}
				scrolling = true;
				t.push(setTimeout(function( ) {
					if (t.length > 1) {
						t.pop();
						return;
					}
					t = [];
					if (e.target.scrollLeft - scrollv > 10) {
						AllSnippets.getInstance().next();
						ArticleManager.getInstance().next();
					}
					else if (e.target.scrollLeft - scrollv < -10) {
						AllSnippets.getInstance().prev();
						ArticleManager.getInstance().prev();
					}
					scrollv = e.target.scrollLeft;
					preventScroll();
				}, 100));
				return false;
			});
		}
		$(document).keydown(function( e ) {
			switch (e.keyCode) {
				
				case 39: {
					AllSnippets.getInstance().next();
					ArticleManager.getInstance().next();
					return false;
				}
				case 37: {
					AllSnippets.getInstance().prev();
					ArticleManager.getInstance().prev();
					return false;
				}
				case 38: {
					AllSnippets.getInstance().up();
					ArticleManager.getInstance().removeHighLight();
					return false;
				}
				case 40: {
					AllSnippets.getInstance().down();
					ArticleManager.getInstance().removeHighLight();
					return false;
				}
				case 8: {
					if (ArticleManager.getInstance().isActive()) {
						Taskbar.getInstance().clickHome(e);
						return false;
					}
				}
				default: {
					AllSnippets.getInstance().removeHighLight();
					ArticleManager.getInstance().removeHighLight();
				}
			}
		});
	};
};
