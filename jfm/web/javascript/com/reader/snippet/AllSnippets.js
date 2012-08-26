fm.Package("com.reader.snippet");
fm.Import("com.reader.snippet.Snippet");
fm.Class("AllSnippets", "jfm.html.Container");
com.reader.snippet.AllSnippets = function (base, me, Snippet, Container){this.setMe=function(_me){me=_me;};
	var firstSnipptes,
	active;
	var currentSelectedSnippet,
	len;
	var totalLength;
	var totalWidth = 0;
	var self, singleton;
	this.multi;
	this.margins;
	
Static.getInstance = function() {
		if(!singleton){
			singleton = new me();
		}
		return singleton;
    };
	
	Private.AllSnippets = function( ) {
		base({
			id:"article-list"
		});
		$("#container").append(this.el);
		firstSnipptes = null;
		totalLength = 0;
		this.multi = 20;
		this.margins = 18;
		self = this;
		active = false;
	};
	
	this.clearStoredData = function() {
		this.el.empty();
   		totalWidth = 0;
   		firstSnipptes=null;
   		totalLength = 0;
   		currentSelectedSnippet = null;
	};
	
	this.active = function() {
		this.el.show().siblings().hide();
		active = true;
		if(currentSelectedSnippet){
			currentSelectedSnippet[0].scrollIntoView(false);
		}
	};
	
	this.isActive = function() {
		return active;
	};
	
	this.deActive = function() {
		active = false;
		this.el.hide();
	};
	
	function prepareContent( title, columns, f_size ) {
                 
		 var container = $("<div/>",{
		    	'class':'item-item-cont',
		    	html : "<h2>"+ title + "</h2>",
		    	css:{
		    			width:	( f_size * f_size + self.margins)* columns ,
		    			height : "100%"
				   	}
			    })
			    .appendTo(self.el);
		 return container;
	}
	this.create = function( resp, clean ) {
		
		len = resp.entries.length - 1;
		var k = -1;
		if(clean){
			this.clearStoredData();
		}
		var columns = Math.ceil(len/3);
		var f_size = parseInt( this.el.css("font-size"));
		totalLength += len;
		var container = prepareContent( resp.title, columns, f_size);
	    totalWidth += (f_size * f_size + self.margins) * columns +  40;
	    this.el.width(totalWidth);
	    function recursive() {
	    	if( k == len - 1){
	    		return;
	    	}
	    	k++;
	    	var bf = new Snippet( resp.entries[k] );
	    	if(!firstSnipptes){
	    		firstSnipptes = bf;
	    	}
	    	if( k % 3 == 0 ){
	    		$("<div class='vertical-news-container'></div>" ).appendTo( container ).append( bf.getBrief( 'even-news-snippet', f_size ) );
	    	}
	    	else if( k % 3 == 1 ){
	    		container.find(".vertical-news-container:last").append(bf.getBrief('middle-news-snippet', f_size));
	    	}
	    	else{
	    		container.find(".vertical-news-container:last").append(bf.getBrief('odd-news-snippet', f_size));
	    	}
	    	setTimeout ( recursive, 10 );
	    	return bf;
	    }
	    recursive();
	};
	this.next = function() {
		if(!active){
			return;
		}
		if( !currentSelectedSnippet  ){
			currentSelectedSnippet = firstSnipptes.html;
			currentSelectedSnippet.addClass("selected");
			return;
		}
		var nextParent = currentSelectedSnippet.parent().next(".vertical-news-container");
                var cls = $.trim(currentSelectedSnippet.attr("class")).split(" ")[1];
		if( nextParent.length != 0 && nextParent.find("." + cls).length != 0 ){
			currentSelectedSnippet.removeClass("selected");			
			currentSelectedSnippet = nextParent.find("." + cls);
			currentSelectedSnippet.addClass("selected")[0].scrollIntoView(false);
			return;
		}
		var nextParent = currentSelectedSnippet.parent().parent().next(".item-item-cont");
		if( nextParent.length != 0 ){
			currentSelectedSnippet.removeClass("selected");
			var cls = $.trim(currentSelectedSnippet.attr("class")).split(" ")[1];
			currentSelectedSnippet = nextParent.find(".vertical-news-container:first").find("." + cls);
			currentSelectedSnippet.addClass("selected")[0].scrollIntoView(false);

		}else{
                        this.el.parent().scrollLeft(this.el.width());
                }
		  
	};
	
	this.prev = function() {
		if(!active){
			return;
		}
		if( !currentSelectedSnippet  ){
			currentSelectedSnippet = firstSnipptes.html;
			currentSelectedSnippet.addClass("selected");
			return;
		}
		var prevParent =  currentSelectedSnippet.parent().prev(".vertical-news-container");
                var cls = $.trim(currentSelectedSnippet.attr("class")).split(" ")[1];
		if( prevParent.length > 0 && prevParent.find("." + cls)){
			currentSelectedSnippet.removeClass("selected");			
			currentSelectedSnippet = prevParent.find("." + cls);
			currentSelectedSnippet.addClass("selected")[0].scrollIntoView(false);
			return;
		}
		var nextParent = currentSelectedSnippet.parent().parent().prev(".item-item-cont");
		if( nextParent.length != 0 && nextParent.find(".vertical-news-container:last").find("." + cls).length != 0  ){
			currentSelectedSnippet.removeClass("selected");
			var cls = $.trim(currentSelectedSnippet.attr("class")).split(" ")[1];
			currentSelectedSnippet = nextParent.find(".vertical-news-container:last").find("." + cls);
			currentSelectedSnippet.addClass("selected")[0].scrollIntoView(false);
		}else{
                        this.el.parent().scrollLeft( 0 );
                }
	};
	
	this.up = function() {
		if(!active){
			return;
		}
		if( !currentSelectedSnippet  ){
			currentSelectedSnippet = firstSnipptes.html;
			currentSelectedSnippet.addClass("selected");
			return;
		}
		if( currentSelectedSnippet.prev().length != 0  ){
			currentSelectedSnippet.removeClass("selected");
			currentSelectedSnippet = currentSelectedSnippet.prev();
			currentSelectedSnippet.addClass("selected")[0].scrollIntoView(false);
		}
	};
	
	this.down = function() {
		if(!active){
			return;
		}
		if( !currentSelectedSnippet  ){
			currentSelectedSnippet = firstSnipptes.html;
			currentSelectedSnippet.addClass("selected");
			return;
		}
		if( currentSelectedSnippet.next().length != 0 ){
			currentSelectedSnippet.removeClass("selected");
			currentSelectedSnippet = currentSelectedSnippet.next();
			currentSelectedSnippet.addClass("selected")[0].scrollIntoView(false);
		}
	};
	
	this.removeHighLight = function() {
		if(!active){
			return;
		}
		if( currentSelectedSnippet ){
			currentSelectedSnippet.removeClass("selected");
		}
	};
	this.showArticle = function() {
		if( active ){
			currentSelectedSnippet.trigger("click");
		}
	};
	this.resize = function(  f_size ) {
		var totalWidth = 0;
		$(".item-item-cont", this.el).each(function() {
			var allsnips = $(".newsSnippet", this);
			allsnips.width( f_size * f_size );
			var cols = Math.ceil(allsnips.length /3 );
			$(this).width( ( allsnips.width() + 17) * cols + 20 );
			totalWidth += (allsnips.width() + 17) * cols + 20 + 40;
		});
		this.el.width( totalWidth );
	};
};