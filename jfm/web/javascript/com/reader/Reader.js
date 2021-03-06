fm.Package("com.reader");
fm.Import("com.reader.snippet.AllSnippets");
fm.Import("com.reader.article.ArticleManager");
fm.Import("com.reader.taskbar.Taskbar");
fm.Import("jfm.html.DomManager");
fm.Import("com.reader.FeedListController");
fm.Import("com.reader.snippet.LeftBar");
fm.Import("jfm.division.Division");
fm.Import('com.reader.events.Events');
fm.Class("Reader");
com.reader.Reader = function(me, AllSnippets, ArticleManager, Taskbar, FeedListController, LeftBar, Division, Events) {
	var division;
	this.setMe = function(_me) {
		me = _me;
	};
	Static.getDivision = function() {
		return division;
	};

	Static.openArticle = function(obj) {
		var f_size = parseInt($("#article-container").css("font-size"));
		$("#hidden").html("<div class='title'>" + obj.title + "</div>" + "<div class='content'>" + obj.content + "</div>");
		AllSnippets.getInstance().deActive();
		ArticleManager.getInstance().active();
		ArticleManager.getInstance().create(f_size);
	};

	function callback(resp, clean) {
		try {
			resp = resp.responseData.feed;
			ArticleManager.getInstance().deActive();
			AllSnippets.getInstance().active();
			AllSnippets.getInstance().create(resp, clean);
		}
		catch (e) {
			console.log(e);
		}
	}

	function updateLayout() {
		$(window).ready(function() {
			var win = jQuery(window);
			win.resize(function() {
				var w = win.width(), h = win.height();
				var m = $('body').width(w).height(h)[0].resize;
				m && m(w, h);
			});
			$('body').trigger('resize');
		});
	}

	Static.main = function() {
		new FeedListController();
		return;
		updateLayout();
		division = new Division({
			id : "main"
		});
		division.addTo(jQuery("body"));
		Taskbar.getInstance(callback);
		division.left.add(LeftBar.getInstance());
		LeftBar.getInstance().create(callback);
		Events.getInstance();
		$("a").live('click', function() {
			window.open(this.href, '_blank');
			return false;
		});
		return false;
	};

	Static.parseRSS = function(url, callback, isGoogle) {
		// windows 8

		if (window.WinJS) {
			url = isGoogle ? 'http://ajax.googleapis.com/ajax/services/feed/load?num=10&v=1.0&q=' + encodeURIComponent(url) + "&output=json_xml" : url;
			WinJS.xhr({
				url : url
			}).done(function(data) {
				callback(JSON.parse(data.response));
			});
		}
		else {
			url = isGoogle ? document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=8&callback=?&q=' + encodeURIComponent(url)
					: url;
			$.ajax({
				url : url,
				dataType : 'json',
				success : callback
			});
		}
	};
};