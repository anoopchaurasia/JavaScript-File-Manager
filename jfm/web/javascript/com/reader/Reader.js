fm.Package("com");
fm.Import("com.reader.snippet.AllSnippets");
fm.Import("com.reader.article.ArticleManager");
fm.Import("com.reader.taskbar.Taskbar");
fm.Import('com.reader.events.Events');
fm.Class("Reader");
com.Reader = function (me, AllSnippets, ArticleManager, Taskbar, Events) {
	
	this.setMe = function( _me ) {
		me = _me;
	};
	
	this.init = function( ) {
		Taskbar.getInstance(callback);
	};
	
	Static.openArticle = function( obj ) {
		var f_size = parseInt($("#article-container").css("font-size")) - 2;
		$("#hidden").html("<div class='title'>" + obj.title + "</div>" + "<div class='content'>" + obj.content + "</div>");
		ArticleManager.getInstance().active();
		AllSnippets.getInstance().deActive();
		ArticleManager.getInstance().create(f_size);
	};
	
	function callback( resp, clean ) {
		AllSnippets.getInstance().active();
		ArticleManager.getInstance().deActive();
		AllSnippets.getInstance().create(resp, clean);
	}
	
	Static.main = function( ) {
		$("#main").height(580).width($(window).width() - 20);
		$(document).scroll(function( ) {
			return false;
		});
		Events.getInstance().keydownEvents();
		Events.getInstance().keyupEvents();
		$("#article-list").show().empty();
		$("a").live('click', function( ) {
			var open_link = window.open('', '_blank');
			open_link.location = this.href;
			return false;
		});
		return false;
	};
};

function parseRSS( url, callback, isGoogle ) {
	url = isGoogle ? document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent(url) : url;
	$.ajax({
	    url : url,
	    dataType : 'json',
	    success : function( data ) {
		    callback(data.responseData.feed);
	    }
	});
}
