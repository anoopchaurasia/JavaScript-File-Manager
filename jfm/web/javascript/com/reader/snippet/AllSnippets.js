fm.Package("com.reader.snippet");
fm.Import("com.reader.snippet.Snippet");
fm.Import("jfm.cookie.Cookie");
fm.Import("com.reader.snippet.SnippetGroup");
fm.Class("AllSnippets", "jfm.html.Container");
com.reader.snippet.AllSnippets = function (base, me, Snippet, Cookie, SnippetGroup, Container) {
	this.setMe = function( _me ) {
		me = _me;
	};
	var resources;
	var active;
	var totalWidth = 0;
	var singleton, currentGroup;
	
	Static.getInstance = function( ) {
		if (!singleton) {
			singleton = new me();
		}
		return singleton;
	};
	
	this.resize = function(w, h){
		if(!active){
			return;
		}
		var clean = true;
		var len =resources.length;
		for(var k =0; k < len; k++){
			this.create(resources[k], clean, true);
			clean = false;
		}
	};
	
	Private.AllSnippets = function( ) {
		var c = com.reader.Reader.getDivision().center;
		base({
			id : "article-list",
			height : "100%"
		});
		resources = [];
		c.add(this);
		Cookie.get("Sfontsize") && this.el.css('font-size', Cookie.get("Sfontsize")+"px");
		active = false;
		c.resize(this.resize);
	};
	
	this.clearStoredData = function( fontChange) {
		this.el.empty();
		currentGroup = null;
		totalWidth = 0;
		!fontChange && (resources = []);
	};
	
	this.active = function( ) {
		active = true;
		this.el.show().siblings().hide();
		com.reader.Reader.getDivision().left.show();
	};
	
	this.isActive = function( ) {
		return active;
	};
	
	this.deActive = function( ) {
		active = false;
		com.reader.Reader.getDivision().left.hide();
		this.el.hide();
	};
	
	this.create = function( resp, clean, fontChange ) {
		if(!active){
			return;
		}
		if (clean) {
			this.clearStoredData(fontChange);
		}
		!fontChange && resources.push(resp);
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
	
	this.changeFont = function(change) {
		if(!active){
			return;
		}
		var f_size = parseInt(this.el.css("font-size")) + change;
		Cookie.set('Sfontsize', f_size);
		me.el.css("font-size", f_size);
		var clean = true;
		var len =resources.length;
		for(var k =0; k < len; k++){
			this.create(resources[k], clean, true);
			clean = false;
		}
    };
};
