fm.Package("com.reader.snippet");
fm.Class("Snippet", "jfm.html.Container");
com.reader.snippet.Snippet = function (base, me, Container) {
	
	this.init = function( ) {
		
		Static.height = 110;
		Static.margins = 18;
		Static.widthAmlifier = 3;
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
		scrollIntoView(this.el.get(0));
	};
	
	this.deActivate = function(){
		this.el.removeClass("selected");
	};
	
	function scrollIntoView(element) {
		var parent = jQuery("#article-list");
		var containerLeft = parent.parent().scrollLeft();
		var containerRight = containerLeft + parent.parent().width();
		var elemLeft = element.offsetLeft;
		var elemRight = elemLeft + $(element).width();
		if (elemLeft < containerLeft) {
			parent.parent().scrollLeft(elemLeft);
		}
		else if (elemRight > containerRight) {
			parent.parent().scrollLeft(elemRight - parent.parent().width() + me.margins);
		}
	}
	
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
    
    this.isSelected = function() {
		return this.el.hasClass('selected');
	};
    
	this.Snippet = function( nb, width, index ) {
		$.extend(true, this, nb);
		base({
		    "class" : 'newsSnippet',
		    height: this.height,
		    indx : String(index),
		    html : this.getTitle() + this.getImage() + this.getBody(),
		    css : {
			    width : width
		    },
			click: me.show
		});
	};
};
