fm.Package("com.reader.snippet");
fm.Import("com.reader.snippet.Snippet");
fm.Import("com.reader.snippet.SnippetGroup");
fm.Class("AllSnippets", "jfm.html.Container");
com.reader.snippet.AllSnippets = function (base, me, Snippet, SnippetGroup, Container) {
	this.setMe = function( _me ) {
		me = _me;
	};
	var active;
	var totalWidth = 0;
	var singleton, currentGroup;
	
	Static.getInstance = function( ) {
		if (!singleton) {
			singleton = new me();
		}
		return singleton;
	};
	
	Private.AllSnippets = function( ) {
		base({
			id : "article-list",
			height : com.reader.Reader.getDivision().center.el.height()
		});
		com.reader.Reader.getDivision().center.add(this);
		active = false;
	};
	
	this.clearStoredData = function( ) {
		this.el.empty();
		totalWidth = 0;
	};
	
	this.active = function( ) {
		this.el.show().siblings().hide();
		active = true;
	};
	
	this.isActive = function( ) {
		return active;
	};
	
	this.deActive = function( ) {
		active = false;
		this.el.hide();
	};
	
	this.create = function( resp, clean ) {
		
		if (clean) {
			this.clearStoredData();
		}
		var f_size = parseInt(this.el.css("font-size"));
		var snippetGroup = new SnippetGroup(resp, this.el.height(), f_size + Snippet.widthAmlifier);
		if(!currentGroup){
			currentGroup = snippetGroup;
		}
		this.add(snippetGroup);
		snippetGroup.addSnippets(resp.entries);
		totalWidth += snippetGroup.el.width() + 40;
		this.el.width(totalWidth);
	};
	this.next = function( ) {
		if (!active) {
			return;
		}
		if(!currentGroup.next() && currentGroup.el.next().length){
			currentGroup = currentGroup.el.next()[0].jfm;
			currentGroup.next();
		}
	};
	
	this.prev = function( ) {
		if (!active) {
			return;
		}
		if(!currentGroup.prev() && currentGroup.el.prev().length){
			currentGroup = currentGroup.el.prev()[0].jfm;
			currentGroup.prev();
		}	
	};
	
	this.up = function( ) {
		if (!active) {
			return;
		}
		currentGroup.up();
	};
	
	this.down = function( ) {
		if (!active) {
			return;
		}
		currentGroup.down();
	};
	
	this.removeHighLight = function( ) {
		if (!active) {
			return;
		}
		currentGroup.removeHighLight();
	};
	this.showArticle = function( ) {
		if (active) {
			currentGroup.showArticle();
		}
	};
	function resize ( f_size ) {
		var totalWidth = 0;
		$(".item-item-cont", me.el).each(function( ) {
			var allsnips = $(".newsSnippet", this);
			allsnips.width(f_size * f_size);
			var cols = Math.ceil(allsnips.length / 3);
			$(this).width((allsnips.width() + 17) * cols + 20);
			totalWidth += (allsnips.width() + 17) * cols + 20 + 40;
		});
		me.el.width(totalWidth);
	}
	
	this.changeFont = function(change) {
		if(!active){
			return;
		}
		var f_size = parseInt(this.el.css("font-size")) + change;
		me.el.css("font-size", f_size);
		resize(f_size + Snippet.widthAmlifier);
    };
};
