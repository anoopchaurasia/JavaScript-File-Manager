fm.Package("com.reader.snippet");
fm.Import("com.reader.snippet.Snippet");
fm.Class("SnippetGroup", "jfm.html.Container");

com.reader.snippet.SnippetGroup = function (base, me, Snippet, Container) {

	var entries, f_size, counterPerColumn, currentSnippet;

	this.setMe = function(_me) {
		me = _me;
	};
	function getWidth(fs){
		var w = jQuery(window).width() - Snippet.margins, cw = fs*fs;
		if( w < cw ){
			return w;
		}
		return cw;
	}
	this.SnippetGroup = function(resp, height, f_s) {
		entries = resp.entries, f_size = f_s;
		var len = resp.entries.length ;
		counterPerColumn = Math.floor((height) / (Snippet.height + Snippet.margins)) ;
		var columns = Math.ceil(len / counterPerColumn);
		base({
			'class' : 'item-item-cont',
			html : "<h2>" + resp.title + "</h2>",
			css : {
				width : ( getWidth(f_size) +  + Snippet.margins) * columns,
				height : "100%"
			}
		});
	};

	this.addSnippets = function() {

		var k = -1, len = entries.length , firstSnipptes;
		var h = Math.ceil(len / counterPerColumn);
		function recursive() {
			if (k == len - 1) {
				return;
			}
			k++;
			var bf = new Snippet(entries[k], getWidth(f_size), k % h);
			if (!firstSnipptes) {
				firstSnipptes = bf;
			}
			if (k % h == 0) {
				$("<div class='vertical-news-container'></div>").appendTo(me.el).append(bf.el);
			}
			else {
				me.el.find(".vertical-news-container:last").append(bf.el);
			}
			setTimeout(recursive, 10);
			return bf;
		}
		recursive();
		currentSnippet = this.el.find(".newsSnippet:first")[0].jfm;
	};

	this.next = function() {

		currentSnippet.deActivate();
		if (!currentSnippet.next()) {
			return false;
		}
		currentSnippet = currentSnippet.next();
		currentSnippet.activate();
		return true;
	};

	this.prev = function() {

		currentSnippet.deActivate();
		if (!currentSnippet.prev()) {
			return false;
		}
		currentSnippet = currentSnippet.prev();
		currentSnippet.activate();
		return true;
	};

	this.up = function() {

		currentSnippet.deActivate();
		if (!currentSnippet.el.parent().prev().length) {
			return false;
		}
		var dom =  currentSnippet.el.parent().prev().find("[indx='" + currentSnippet.el.attr('indx') + "']")[0];
		if(!dom){
			return false;
		}
		currentSnippet = dom && dom.jfm;
		currentSnippet.activate();
		return true;
	};

	this.down = function() {

		currentSnippet.deActivate();
		if (!currentSnippet.el.parent().next().length) {
			return false;
		}
		var dom =  currentSnippet.el.parent().next().find("[indx='" + currentSnippet.el.attr('indx') + "']")[0];
		if(!dom){
			return false;
		}
		currentSnippet = dom && dom.jfm;
		currentSnippet.activate();
		return true;
	};

	this.removeHighLight = function() {
		currentSnippet.deActivate();
	};

	this.showArticle = function() {
		currentSnippet.show();
	};
};