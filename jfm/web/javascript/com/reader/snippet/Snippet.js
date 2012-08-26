fm.Package("com.reader.snippet");
fm.Class("Snippet");
com.reader.snippet.Snippet = function (me) {
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
	
	this.onClick = function( ) {
		var self = this;
		this.html.click(function( ) {
			com.Reader.openArticle(self);
		});
	};
	
	this.getBrief = function( cls, f_size ) {
		
		this.html = $("<div/>", {
		    "class" : 'newsSnippet ' + cls,
		    html : this.getTitle() + this.getImage() + this.getBody(),
		    css : {
			    width : f_size * f_size
		    }
		});
		this.onClick();
		return this.html;
	};
	
	this.Snippet = function( nb ) {
		$.extend(true, this, nb);
	};
};
