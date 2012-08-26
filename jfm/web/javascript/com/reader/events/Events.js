fm.Package("com.reader.events");
fm.Import("com.reader.snippet.AllSnippets");
fm.Import("com.reader.article.ArticleManager");
fm.Import("com.reader.taskbar.Taskbar");
fm.Class("Events");
com.reader.events.Events = function (me, AllSnippets, ArticleManager, Taskbar){this.setMe=function(_me){me=_me;};
	var singleton;
	
	
	Static.getInstance = function(){
		if(!singleton){
			singleton = new me();
		}
		return singleton;
	};

	Private.Events = function( ) {};
	
	this.keyupEvents = function( ) {
		$(document).keyup(function( e ) {
			switch (e.keyCode) {
				case 13: {
					AllSnippets.getInstance().showArticle();
					break;
				}
				case 36: {
					Taskbar.getInstance().clickHome();
					break;
				}
				case 8: {
					if (!AllSnippets.getInstance().isActive()) {
						Taskbar.getInstance().clickHome();
						return false;
					}
					break;
				}
			}
			return false;
		});
	};
	
	this.keydownEvents = function( ) {
		
		$(".left-navigation", Taskbar.getInstance().el).mousedown(function( ) {
			AllSnippets.getInstance().prev();
			ArticleManager.getInstance().prev();
		});
		$(".up-navigation", Taskbar.getInstance().el).mousedown(function( ) {
			AllSnippets.getInstance().up();
		});
		$(".right-navigation", Taskbar.getInstance().el).mousedown(function( ) {
			AllSnippets.getInstance().next();
			ArticleManager.getInstance().next();
		});
		$(".down-navigation", Taskbar.getInstance().el).mousedown(function( ) {
			AllSnippets.getInstance().down();
		});
		$(document).keydown(function( e ) {
			switch (e.keyCode) {
				
				case 39: {
					AllSnippets.getInstance().next();
					ArticleManager.getInstance().next();
					return false;
					break;
				}
				case 37: {
					AllSnippets.getInstance().prev();
					ArticleManager.getInstance().prev();
					return false;
					break;
				}
				case 38: {
					AllSnippets.getInstance().up();
					ArticleManager.getInstance().removeHighLight();
					return false;
					break;
				}
				case 40: {
					AllSnippets.getInstance().down();
					ArticleManager.getInstance().removeHighLight();
					return false;
					break;
				}
				default: {
					AllSnippets.getInstance().removeHighLight();
					ArticleManager.getInstance().removeHighLight();
					return false;
				}
					
			}
		});
	};
	
};
