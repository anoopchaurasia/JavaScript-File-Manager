fm.Package("com.reader.snippet");
fm.Class("Snippet", "jfm.html.Container");
com.reader.snippet.Snippet = function (base, me, Container) {
	
	this.init = function( ) {
		
		Static.height = 110;
		Static.margins = 18;
		Static.widthAmlifier = 2;
	};
	
	this.setMe = function( _me ) {
		me = _me;
	};
	
	this.getBody = function( ) {
		var html = "<div class='brief-body'>" + "<p>" + this.contentSnippet + "</p>" + "</div>";
		return html;
	};
	
	this.getTitle = function( ) {
		var html = "<div class='brief-title'>" + "<h2 class='title'>" + this.title + "</h2>" + "</div>";
		return html;
	};
	
	this.getImage = function( ) {
		var html = "<div class='brief-image'>";
		if (this.mediaGroups) {
			html += "<img src='" + this.mediaGroups[0].contents[0].url + "' />";
		}
		html += "</div>";
		return html;
	};
	
	this.show = function( ) {
		com.reader.Reader.openArticle(me);
	};
	
	this.activate = function(){
		this.el.addClass("selected");
	};
	
	this.deActivate = function(){
		this.el.removeClass("selected");
	};
	
	this.next = function() {
		if(!this.el.next().length){
    		return false;
    	}
    	return this.el.next()[0].jfm;
    };
    
    this.prev = function() {
    	if(!this.el.prev().length){
    		return false;
    	}
    	return this.el.prev()[0].jfm;
    };
    
	this.Snippet = function( nb, f_size, index ) {
		$.extend(true, this, nb);
		base({
		    "class" : 'newsSnippet',
		    height: this.height,
		    indx : String(index),
		    html : this.getTitle() + this.getImage() + this.getBody(),
		    css : {
			    width : (f_size) * ( f_size)
		    },
			click: me.show
		});
	};
};
