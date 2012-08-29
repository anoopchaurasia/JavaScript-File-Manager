fm.isConcatinated = true; 

fm.Package("jfm.component");
fm.Class("Component");
jfm.component.Component = function (me){this.setMe=function(_me){me=_me;};

    
    this.shortHand = "Component";
    
    this.Component = function(){
        this.el = jQuery.apply(this, arguments);
    };

    function addAt(me, index, obj){
        obj = typeof obj =='string' ? obj : Component.isComponent(obj)? obj.el : jQuery(obj);
        var child;
        me.el.children().each(
        function( indx, o){
            if( index == indx){
                child = jQuery(o);
                return false;
            }
        });
        if(!child){
            addAtEnd(me, obj);
        }
        else{
            child.before(obj);
            obj instanceof jQuery && obj[0].jfm &&  obj[0].jfm.afterRender && obj[0].jfm.afterRender(me.el);
        }
    }
    
    function addAtEnd(me, obj){
        var o = typeof obj =='string' ? obj : Component.isComponent(obj)? obj.el : jQuery(obj);       
        me.el.append( o );
        o instanceof jQuery && o[0].jfm &&  o[0].jfm.afterRender && o[0].jfm.afterRender(me.el);
    }
    
    function createElem (obj){
        
        if(typeof obj =='string' || obj instanceof jQuery){
            return obj;
        }
        else if( obj.el instanceof jQuery){
            return obj.el;
        }
        else if(jQuery.isArray(obj)){
            return obj;
        }
        else{
            var items = obj.items,
            newItems = [],
            Class,
            defaultProp = obj.defaultProp,
            cls = defaultProp.Class;
            delete defaultProp.Class; 
            for(var k = 0; k < items.length; k++){
                Class = items[k].Class || cls;
                delete items[k].Class;
                newItems.push(new Class(jQuery.extend( {}, defaultProp, items[k])));
            }
        }
        return newItems;
    }
    
    this.add = function(index, obj){
        this.testing = 67;
        if(jQuery.isNumeric(index)){
            obj = createElem(obj);
            if(jQuery.isArray(obj)){
                for(var k = 0; k< obj.length; k++){
                    addAt(this, index, obj[k] );
                }
            }
            else{
                addAt(this, index, obj );
            }
        }
        else{
            obj = createElem(index);
            if(jQuery.isArray(obj)){
                for(var k = 0; k < obj.length; k++){
                    addAtEnd(this, obj[k]);
                }
            }
            else{
                addAtEnd(this, obj);
            }
        }
    };     
    
    this.method = function(){
        var arr = [];
        for(var k =1; k < arguments.length; k++){
            arr.push(arguments[k]);
        }
        return this.el[arguments[0]].apply(this.el, arr);
    };
    
    Static.isComponent = function(obj){
        return typeof obj.instanceOf == 'function' &&  obj.el instanceof jQuery;
    };
    
    Static.getCSSClass = function(c, cls){
        return (c? c : "" ) + " "+ cls;
    };
};


/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
fm.Package("jfm.html");
fm.Class("Container", 'jfm.component.Component');
jfm.html.Container = function (base, me, Component){this.setMe=function(_me){me=_me;};
    
    this.shortHand = "Container";
    this.Container = function(config){
        var draggable = config && config.draggable;
        if(config){
            delete config.draggable;
        }
        if(config instanceof jQuery ){
        	base(config);
        }else{
        	base( '<div />', jQuery.extend(true, {}, config) );
        }
        if(draggable){
            this.el.draggable({
                revert: true
              
            });
        }
    };

};


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
fm.Package("jfm.cookie");
fm.Class("Cookie");
jfm.cookie.Cookie = function (me){this.setMe=function(_me){me=_me;};
	
	Static.set = function(name, value, days) {
		var expires = "";
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			expires = "; expires="+date.toGMTString();
		}
		document.cookie = name+"="+value+expires+"; path=/";
    };
	
	Static.get = function(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
    };
	
	Static.erase = function(name) {
	    this.set(name);
    };
};fm.Package("com.reader.snippet");
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

		if (!currentSnippet.isSelected()) {
			currentSnippet.activate();
			return true;
		}
		currentSnippet.deActivate();
		if (!currentSnippet.next()) {
			return false;
		}
		currentSnippet = currentSnippet.next();
		currentSnippet.activate();
		return true;
	};

	this.prev = function() {
		if (!currentSnippet.isSelected()) {
			currentSnippet.activate();
			return true;
		}
		currentSnippet.deActivate();
		if (!currentSnippet.prev()) {
			return false;
		}
		currentSnippet = currentSnippet.prev();
		currentSnippet.activate();
		return true;
	};

	this.up = function() {
		if (!currentSnippet.isSelected()) {
			currentSnippet.activate();
			return true;
		}
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
		if (!currentSnippet.isSelected()) {
			currentSnippet.activate();
			return true;
		}
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
};fm.Package("com.reader.snippet");
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
	
	this.create = function( resp, clean, fontChange ) {
		
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
fm.Package("com.reader.filler");
fm.Class("FillContent");
com.reader.filler.FillContent = function (me){this.setMe=function(_me){me=_me;};
    $.fn.SkipRoot = function () {
    	this.find("*").filter(function(){
    		return this.tagName.toLowerCase() != 'br' && $.trim($(this).text()) == '';
    	}).remove();
    };
    $.fn.htmlTruncate = function (strt, max, settings) {
        settings = jQuery.extend({
            chars: /\s/
        }, settings);
        var myRegEx = /<\/?[^<>]*\/?>/gim;
        var $this = this;
        var myStrOrig = $this.html();
        var myStr = myStrOrig;
        var myRegExArray;
        var myRegExHash = {};
        while ((myRegExArray = myRegEx.exec(myStr)) != null) {
            if (myRegExHash[(myRegExArray.index - strt) < (myRegExHash[0] == undefined ? 0 : (myRegExHash[0].length)) ? 0 : (myRegExArray.index - strt)] != undefined)
                myRegExHash[0] += myRegExArray[0];
            else
                myRegExHash[(myRegExArray.index - strt) < 0 ? 0 : (myRegExArray.index - strt)] = myRegExArray[0];
        }
        myStr = jQuery.trim(myStr.split(myRegEx).join(""));
        var totalLen = myStr.length;
        if (strt != 0) {
            myStr = myStr.substring(strt, myStr.length);//strt is removing text only thats why we need tags
        }
        
        if (myStr.length > max) {
            var c;
            while (max > 0) {
                c = myStr.charAt(max);
                if (c.match(settings.chars)) {
                    myStr = myStr.substring(0, max);
                    break;
                }
                max--;
            }
        }else{
        	max = totalLen;
        }
        var start = 0;
        if(strt != 0  && myRegExHash[0]){
        	start = myRegExHash[0].length;
        }
        var end = 0;
        if ( myStrOrig.search(myRegEx) != -1 ) {
            for ( var eachEl in myRegExHash ) {
            	if(end == 0 && eachEl >= myStr.length){
            		end = myStr.length;
            	}
            	myStr = [myStr.substring(0, eachEl ), myRegExHash[eachEl], myStr.substring(eachEl , myStr.length)].join("");
            }
        }
        if(end == 0 ){
        	end = myStr.length;
        }
        myStr = myStr.substring(0, start).replace(/<br\s*\/?>/mgi,"")+
        			myStr.substring( start, end)+
        		myStr.substring(end, myStr.length).replace(/<br\s*\/?>/mgi,"");
        $(this).html(myStr);
        $(this).SkipRoot();
        return [ max + 1, totalLen];
    };
    function charsPerLine(dom){
    	
    	var target_width = dom.width(); // line width
    	var text = 'I want to know how many chars of this text fit.';
    	var span = document.createElement('span');
    	dom.html(span);
    	span.style.whiteSpace = 'nowrap';
    	var fit = text.length;
    	span.innerHTML = text;
    	var chars = Math.floor( target_width/span.offsetWidth * fit );
    	return chars - 3;
    }
    this.truncateWithHeight = function (dom, from, origHtml) {
    	var cpl = charsPerLine( dom );
    	var lineHeight = parseInt(dom.css("line-height"));
    	 var ownHeight = dom.height();
    	var nols = Math.floor( ownHeight / lineHeight);
    	var totalChars = cpl*nols;
    	dom.html(origHtml);
        var lastCharOffset = dom.htmlTruncate(from, totalChars);
        var step = 3;
        var brs = dom.find("br");
        var ps = dom.find("p");
        $(ps[0]).css("margin-top","0px");
        var decrease = 0;
        
        var relativeHeight = dom.get(0).offsetTop +  ownHeight;
        for(var i = 0; i < brs.length; i++){
            if (relativeHeight > brs[i].offsetTop ) {
                decrease++;
            }
        }
        for(var i = 0; i < ps.length - 1; i++){
            if (relativeHeight > ps[i].offsetTop ) {
                decrease++;
            }
        }
        var totalLen = lastCharOffset[1];
        console.log(decrease);
       decrease = Math.floor( decrease * cpl / 1.7 );
       var count = 0;
        while (ownHeight < dom.get(0).scrollHeight) {
            lastCharOffset = dom.htmlTruncate(0, lastCharOffset[0]- step - decrease );
            count++;
            decrease = 0;
            if(lastCharOffset[0] <=0){
            	lastCharOffset[0] = 0;
            	break;
            }
        }
        dom.html(dom.html().replace(/<\/a>/mgi, "</a> "));
        return [from + lastCharOffset[0], totalLen - from - lastCharOffset[0] ];
    };
	this.FillContent = function() {
		
	};
};fm.Package("com.reader.article");
fm.Class("ImageContainer", "jfm.html.Container");
com.reader.article.ImageContainer = function (base, me, Container){this.setMe=function(_me){me=_me;};
	var f_size, contentColumns, columnInsideImageWidth, imageContainerWidth;
	this.ImageContainer = function(images, f_s, multi, margins, height, width){
		if (images.length == 0 || $.trim(images[0].text) == "") {
			imageContainerWidth = 0;
			return 0;
		}
		imageContainerWidth = width > 500 ? 500 : width;
		f_size = f_s;
		var columnWidth = f_size * multi + margins;
		contentColumns = imageContainerWidth / columnWidth;
		if (contentColumns - 1 > .7) {
			contentColumns = 2;
		}
		else {
			contentColumns = 1;
		}
		columnInsideImageWidth = Math.floor(imageContainerWidth / contentColumns - margins / 2 - 2);
		base({
		    width : imageContainerWidth,
		    height : height,
		    'class' : "imageContainer selector parent"
		});		
		this.add(addImage(images[0]) );
	};
	
	function addImage(img) {
		return new Container({
			  width : "90%",
			    height:255,
			    "class" : "image-container",
			    html : "<img  src='" + img.href + "'/><div class='imagetext'>" + img.text + "</div>"
		});
	}
	
	this.getWidth = function() {
		return imageContainerWidth? imageContainerWidth + 27 : 0;
    };
	
	this.getColumns = function() {
		return contentColumns;
	};
	
	this.getSingleColumnWidth = function() {
		return columnInsideImageWidth;
	};
};fm.Package("com.reader.article");
fm.Import("com.reader.filler.FillContent");
fm.Import("jfm.cookie.Cookie");
fm.Import("com.reader.article.ImageContainer");
fm.Class("ArticleManager", "jfm.html.Container");
com.reader.article.ArticleManager = function (base, me, FillContent, Cookie, ImageContainer, Container) {
	this.setMe = function( _me ) {
		me = _me;
	};
	var setTimeOut, multi, currentSelected, active, singleton;
	var margins;
	var self = this;
	this.title;
	this.content;
	this.imageHeight;
	this.imageContainerWidth;
	Static.getInstance = function( ) {
		
		if (!singleton) {
			singleton = new me();
		}
		return singleton;
	};
	this.resize = function( w, h ) {
		if(!active){
			return;
		}
		this.create(parseInt(this.el.css("font-size")), true);
	};
	Private.ArticleManager = function( ) {
		var c = com.reader.Reader.getDivision().center;
		base({
		    id : "article-container",
		    height : "100%"
		});
		c.add(this);
		Cookie.get("Afontsize") && this.el.css('font-size', Cookie.get("Afontsize") + "px");
		setTimeOut = -9;
		multi = 18;
		active = false;
		margins = 36;
		this.imageHeight = 400;
		c.resize(this.resize);
	};
	this.next = function( ) {
		if (!active) {
			return;
		}
		if (!currentSelected.hasClass("column-selected")) {
			currentSelected.addClass("column-selected");
			scrollIntoView(currentSelected.get(0));
			return;
		}
		
		if (currentSelected.next().length != 0) {
			currentSelected.removeClass("column-selected");
			currentSelected = currentSelected.next().addClass("column-selected");
			scrollIntoView(currentSelected.get(0));
			changed({
				type : "next"
			});
		}
		else {
			this.el.parent().scrollLeft(this.el.width());
		}
	};
	function scrollIntoView( element ) {
		var containerLeft = me.el.parent().scrollLeft();
		var containerRight = containerLeft + me.el.parent().width();
		var elemLeft = element.offsetLeft;
		var elemRight = elemLeft + $(element).width();
		if (elemLeft < containerLeft) {
			me.el.parent().scrollLeft(elemLeft);
		}
		else if (elemRight > containerRight) {
			me.el.parent().scrollLeft(elemRight - me.el.parent().width() + margins - 10);
		}
	}
	
	this.prev = function( ) {
		if (!active) {
			return;
		}
		if (!currentSelected.hasClass("column-selected")) {
			currentSelected.addClass("column-selected");
			scrollIntoView(currentSelected.get(0));
			return;
		}
		if (currentSelected.prev(".selector").length != 0) {
			currentSelected.removeClass("column-selected");
			currentSelected = currentSelected.prev().addClass("column-selected");
			scrollIntoView(currentSelected.get(0));
			changed({
				type : "prev"
			});
		}
		else {
			this.el.parent().scrollLeft(0);
		}
	};
	
	function changed( obj ) {
		for ( var i = 0; i < changeCbArray.length; i++) {
			changeCbArray[i](obj);
		}
	}
	;
	
	var changeCbArray = [];
	this.registerChange = function( cb ) {
		changeCbArray.push(cb);
	};
	this.removeHighLight = function( ) {
		if (!active) {
			return;
		}
		currentSelected.removeClass("column-selected");
	};
	
	function createHeader( title ) {
		var div = $("<div />", {
		    'class' : 'title',
		    html : "<h2>" + title + "</h2>"
		}).appendTo(me.el);
		return {
		    height : div.height(),
		    width : div.width()
		};
	}
	
	this.active = function( ) {
		active = true;
		this.el.show();
	};
	
	this.deActive = function( ) {
		active = false;
		this.el.hide();
	};
	
	this.isActive = function( ) {
		return active;
	};
	
	function prepareHtml( ) {
		if (!self.imgInfo) {
			self.imgInfo = [];
			var imgsInfo = $("#hidden >.content").find("img").parents("div:first").not(".content").clone();
			var imgi = {};
			for ( var i = 0; i < imgsInfo.length; i++) {
				imgi = {};
				imgi.href = $("img", imgsInfo[i]).attr("src");
				imgi.height = $("img", imgsInfo[i]).height();
				imgi.text = $(imgsInfo[i]).text();
				self.imgInfo.push(imgi);
			}
		}
		$("#hidden").find("*").filter(function( ) {
			return this.tagName.toLowerCase() != 'br' && this.tagName.toLowerCase() != 'img' && $.trim($(this).text()) == '';
		}).remove();
		self.imgages = $("#hidden >.content").find("*").width('').height('').find("img");
		self.content = $.trim($("#hidden >.content").html().replace(/[\s\s]+/, " ").replace(/\n+/, " ").replace(/>\s+/, ">")).replace(/\r\n/gim, "").replace(/^\s/gim, "");
		self.htmlLength = self.content.length;
		$("#hidden >.content").find("img").parent().not(".content").remove();
		$("#hidden >.content").find(">br, script").remove();
		self.title = $("#hidden >.title").text();
	}
	function getWidth(fs){
		var w = jQuery(window).width() - margins, cw = fs*multi;
		if( w < cw ){
			return w;
		}
		return cw;
	}
	this.create = function( f_size, isTaskbar ) {
		if (!isTaskbar) {
			self.imgInfo = undefined;
		}
		var articalWidth = getWidth( f_size);
		var articleContainer = this.el.empty();
		var trancatedLength = [ 0, 1 ];
		var htm = "<div class='parent selector'><div class='s'></div></div>";
		if (setTimeOut) {
			clearTimeout(setTimeOut);
		}
		prepareHtml();
		var bodyHeight = this.el.height();
		var content = new FillContent(this.content);
		var header = createHeader(this.title);
		var imageContainer = new ImageContainer(self.imgInfo, f_size, multi, margins, bodyHeight - header.height - margins, articalWidth);
		var columns = imageContainer.getColumns() || 0;
		columns && this.add(imageContainer);
		var i = 0;
		function recursive( ) {
			var removeHeight = margins + header.height;
			if (trancatedLength[1] <= 0) {
				return;
			}
			i++;
			var elem;
			articleContainer.width((i - columns) * (articalWidth + margins) + imageContainer.getWidth());
			if (i <= columns) {
				removeHeight += imageContainer.el.find(".image-container").height();
				elem = $(htm).appendTo(imageContainer.el).removeClass("parent").addClass("text-inside-image");
				elem.find("div.s").height(bodyHeight - removeHeight).width(imageContainer.getSingleColumnWidth());
			}
			else {
				elem = $(htm).appendTo(articleContainer);
				elem.find("div.s").height(bodyHeight - removeHeight -10).width(articalWidth);
			}
			trancatedLength = content.truncateWithHeight(elem.find("div.s"), trancatedLength[0], self.content);
			setTimeOut = setTimeout(recursive, 10);
		}
		recursive();
		currentSelected = $("#article-container").find("div.selector:first");
		changed();
	};
	this.getSelectedColumn = function( ) {
		return currentSelected.clone(true);
	};
	this.getSelectedFontSize = function( ) {
		return currentSelected.css('font-size');
	};
	
	this.changeFont = function( change ) {
		if (!active) {
			return;
		}
		var f_size = parseInt(this.el.css("font-size")) + change;
		Cookie.set('Afontsize', f_size);
		me.el.empty().css("font-size", f_size);
		this.create(f_size, true);
	};
};
fm.Package("com.reader.settings");
fm.Class("Settings", "jfm.html.Container");
com.reader.settings.Settings = function (base, me, Container) {
	this.setMe = function( _me ) {
		me = _me;
	};
	var data, singleton, callback;
	
	Static.getInstance = function( cb ) {
		if (!singleton) {
			singleton = new me(cb);
		}
		return singleton;
	};
	
	function submit( ) {
		var arr = $(this).serializeArray();
		for ( var k in arr) {
			callback(arr[k].value);
		}
		return false;
	}
	
	this.disable = function( ) {
		
		this.el.hide();
	};
	this.enable = function( ) {
		
		this.el.show();
	};
	this.Settings = function( ) {
		base({
		    id : 'settings',
		    html : "<div><form method='POST' id='settingsForm'> </form></div>"
		});
		this.el.find("form").submit(submit);
		data = [ {
		    url : "http://www.thehindu.com/?service=rss",
		    name : "The Hindu"
		}, {
		    url : "http://feeds.mashable.com/Mashable",
		    name : "Mashable"
		}, {
		    url : "http://timesofindia.feedsportal.com/c/33039/f/533965/index.rss",
		    name : "Times Of India"
		}, {
		    url : "http://feeds.hindustantimes.com/HT-NewsSectionPage-Topstories",
		    name : "Hindustan Times Top Stories"
		}, {
		    url : "http://feeds.reuters.com/reuters/INtopNews",
		    name : "Business Standard"
		}, {
		    url : "http://www.espncricinfo.com/rss/content/feeds/news/0.xml",
		    name : "Cricinfo"
		}, {
		    url : "http://feeds.feedburner.com/fakingnews",
		    name : "Faking News",
		    selected : true
		} ];
	};
	this.changeSettings = function( cb ) {
		callback = cb;
		var html = "";
		for ( var k = 0; k < data.length; k++) {
			html += "<div class='items'><label><input name='" + data[k].name + "' value=' " + data[k].url + "' type='checkbox'/>&nbsp;&nbsp;&nbsp;&nbsp;" + data[k].name + "</label></div>";
		}
		html += "<div class='items'><input type='submit' value='Save' /> </div>";
		this.el.find("form").html(html);
	};
	
	this.getSelectedUrl = function( ) {
		for ( var k = 0; k < data.length; k++) {
			if (data[k].selected) {
				return data[k].url;
			}
		}
		return "";
	};
};
fm.Package("com.reader.taskbar");
fm.Import("com.reader.snippet.AllSnippets");
fm.Import("com.reader.article.ArticleManager");
fm.Import("com.reader.settings.Settings");
fm.Class("Taskbar", "jfm.html.Container");
com.reader.taskbar.Taskbar = function (base, me, AllSnippets, ArticleManager, Settings, Container) {
	this.setMe = function( _me ) {
		me = _me;
	};
	var callback, singleton;
	
	Static.getInstance = function( cb ) {
		if (!singleton) {
			singleton = new me(cb);
		}
		return singleton;
	};
	
	Private.Taskbar = function( cb ) {
		callback = cb;
		base({
		    id : "taskbar",
		    height : 50,
		    html : jQuery("#taskbar-template").html()
		});
		com.reader.Reader.getDivision().center.add(Settings.getInstance());
		Settings.getInstance().disable();
		com.reader.Reader.getDivision().bottom.add(this);
		$(".controlers .plus", this.el).click(increaseFontSize);
		$(".controlers .minus", this.el).click(decreaseFontSize);
		$(".home a", this.el).click(me.clickHome);
		$(">.news-feed-select a", this.el).click(changeSettings);
		getData(Settings.getInstance().getSelectedUrl());
	};
	function increaseFontSize( ) {
		ArticleManager.getInstance().changeFont(+2);
		AllSnippets.getInstance().changeFont(+2);
		return false;
	}
	function decreaseFontSize( ) {
		
		ArticleManager.getInstance().changeFont(-2);
		AllSnippets.getInstance().changeFont(-2);
		return false;
	}
	
	function changeSettings( e ) {
		
		ArticleManager.getInstance().deActive();
		AllSnippets.getInstance().deActive();
		Settings.getInstance().enable();
		Settings.getInstance().changeSettings(function(url) {
			getData(url);
			Settings.getInstance().disable();
			AllSnippets.getInstance().active();
        });
		return false;
	}
	
	function getData(url) {
		AllSnippets.getInstance().clearStoredData();
		com.reader.Reader.parseRSS(url, callback, true);
	}
	
	this.clickHome = function( e ) {
		e.preventDefault();
		if (!AllSnippets.getInstance().isActive()) {
			AllSnippets.getInstance().active();
			ArticleManager.getInstance().deActive();
		}
		return false;
	};
};
 
fm.Package("jfm.division");
fm.Class("Part","jfm.component.Component");
jfm.division.Part = function (base, me, Component){this.setMe=function(_me){me=_me;};

    var set, division, resizeCB;    
    this.Part = function(config, divsn, s){
        set = s;
        resizeCB = [];
        division = divsn;
        config.css = config.css || {};
        config.css.display = 'none';
        base('<div />',config);
    };
    
    this.add = function(elem){        
        set(elem);
        elem;
    };
    
    this.reset = function(){
        this.el.empty();
        this.el.css({ 'display':'none',height:0, width:0 });
        division.updateLayout();
        return this;
    };
    
    this.resize = function(fn) {
    	if(typeof fn == 'function'){
    		resizeCB.push(fn);
    	}else{
    		var w= this.el.width(); h = this.el.height();
    		for(var k = 0; k < resizeCB.length; k++){
    			resizeCB[k](w, h);
    		}
    	}
    };
};

fm.Package("jfm.division");
fm.Import("jfm.division.Part");
fm.Class("Division", "jfm.html.Container");
jfm.division.Division = function (base, me, Part, Container){this.setMe=function(_me){me=_me;};

	var width, height, me;
	this.addTo = function( container ) {
		var timeoutID;
		container = Component.isComponent(container) ? container.el : jQuery(container);
		me.ownerCt = container;
		container[0].resize = function( w, h ) {
			timeoutID && clearTimeout(timeoutID)
			;
			timeoutID = setTimeout(function( ) {
				width = w;
				height = h;
				me.updateLayout();
				timeoutID = 0;
			}, 300);
		};
		this.el.appendTo(container);
		width = container.width();
		height = container.height();
		this.updateLayout();
	};
	
	this.init = function( ) {
		Static.config = {
		    width : "100%",
		    height : "100%",
		    'class' : 'jfm-division'
		};
	};
	
	this.Division = function( config ) {
		me = this;
		var container = config && config.addTo;
		if (config) {
			delete config.addTo;
		}
		config = jQuery.extend({}, this.config, config);
		height = width = 0;
		base(config);
		this.top = new Part({
			'class' : "jfm-division-top"
		}, this, function( elem ) {
			set(elem, me.top, 0, 0);
		});
		this.left = new Part({
			'class' : "jfm-division-left"
		}, this, function( elem ) {
			set(elem, me.left, 0, getRemainingHeight());
		});
		this.center = new Part({
			'class' : "jfm-division-center"
		}, this, function( elem ) {
			set(elem, me.center, getRemainingWidth(), getRemainingHeight());
		});
		me.center.el.css("overflow", 'hidden');
		this.center.el.show();
		this.right = new Part({
			'class' : "jfm-division-right"
		}, this, function( elem ) {
			set(elem, me.right, 0, getRemainingHeight());
		});
		this.bottom = new Part({
			'class' : "jfm-division-bottom"
		}, this, function( elem ) {
			set(elem, me.bottom, 0, 0);
		});
		this.add([ this.top, this.left, this.center, this.right, this.bottom ]);
		if (container) {
			this.addTo(container);
		}
	};
	
	function getRemainingWidth( ) {
		var w = (me.left && me.left.el[0].offsetWidth) || 0;
		w += (me.right && me.right.el[0].offsetWidth) || 0;
		return width - w;
	}
	
	function getRemainingHeight( ) {
		var h = (me.bottom && me.bottom.el.height()) || 0;
		h += (me.top && me.top.el.height()) || 0;
		return height - h;
	}
	
	this.updateLayout = function( ) {
		var h = getRemainingHeight();
		var w = getRemainingWidth();
		me.top && me.top.el.width(width);
		me.bottom && me.bottom.el.width(width);
		me.left && me.left.el.height(h);
		me.right && me.right.el.height(h);
		var m = me.center && me.center.el.height(h).width(w) && me.center.resize;
		m && m(w, h);
	};
	
	function set( obj, appender, difW, difH ) {
		if (obj && obj.instanceOf && obj.el instanceof jQuery) {
			// TODO
		}
		else {
			obj = new Container(obj);
		}
		difH && appender.el.height(difH);
		appender.el.show();
		if (difH > appender.el.height()) {
			difW = difW - 20;
		}
		difW && appender.el.width(difW);
		obj.el.appendTo(appender.el);
		!difW && appender.el.width(obj.el.width());
		!difH && appender.el.height(obj.el.height());
		me.updateLayout();
		return obj;
	}
};


fm.Package("com.reader.events");
fm.Import("com.reader.snippet.AllSnippets");
fm.Import("com.reader.article.ArticleManager");
fm.Import("com.reader.taskbar.Taskbar");
fm.Class("Events");
com.reader.events.Events = function (me, AllSnippets, ArticleManager, Taskbar) {
	this.setMe = function( _me ) {
		me = _me;
	};
	var singleton;
	
	Static.getInstance = function( ) {
		if (!singleton) {
			singleton = new me();
		}
		return singleton;
	};
	
	Private.Events = function( ) {
		this.keyupEvents();
		this.keydownEvents();
	};
	
	this.keyupEvents = function( ) {
		$(document).keyup(function( e ) {
			switch (e.keyCode) {
				case 13: {
					AllSnippets.getInstance().showArticle();
					return false;
				}
				case 36: {
					Taskbar.getInstance().clickHome(e);
					return false;
				}
				case 8: {
					if (!AllSnippets.getInstance().isActive()) {
						Taskbar.getInstance().clickHome(e);
						return false;
					}
					return false;
				}
			}
		});
	};
	
	this.keydownEvents = function( ) {
		
		$(".left-navigation", Taskbar.getInstance().el).mousedown(function( ) {
			AllSnippets.getInstance().prev();
			ArticleManager.getInstance().prev();
			return false;
		});
		$(".up-navigation", Taskbar.getInstance().el).mousedown(function( ) {
			AllSnippets.getInstance().up();
			return false;
		});
		$(".right-navigation", Taskbar.getInstance().el).mousedown(function( ) {
			AllSnippets.getInstance().next();
			ArticleManager.getInstance().next();
			return false;
		});
		$(".down-navigation", Taskbar.getInstance().el).mousedown(function( ) {
			AllSnippets.getInstance().down();
			return false;
		});
		$(document).keydown(function( e ) {
			switch (e.keyCode) {
				
				case 39: {
					AllSnippets.getInstance().next();
					ArticleManager.getInstance().next();
					return false;
				}
				case 37: {
					AllSnippets.getInstance().prev();
					ArticleManager.getInstance().prev();
					return false;
				}
				case 38: {
					AllSnippets.getInstance().up();
					ArticleManager.getInstance().removeHighLight();
					return false;
				}
				case 40: {
					AllSnippets.getInstance().down();
					ArticleManager.getInstance().removeHighLight();
					return false;
				}
				case 8: {
					if (!AllSnippets.getInstance().isActive()) {
						Taskbar.getInstance().clickHome(e);
						return false;
					}
					return false;
				}
				default: {
					AllSnippets.getInstance().removeHighLight();
					ArticleManager.getInstance().removeHighLight();
				}
					
			}
		});
	};
};
fm.Package("com.reader");
fm.Import("com.reader.snippet.AllSnippets");
fm.Import("com.reader.article.ArticleManager");
fm.Import("com.reader.taskbar.Taskbar");
fm.Import("jfm.division.Division");
fm.Import('com.reader.events.Events');
fm.Class("Reader");
com.reader.Reader = function (me, AllSnippets, ArticleManager, Taskbar, Division, Events) {
	var division;
	this.setMe = function( _me ) {
		me = _me;
	};
	Static.getDivision = function( ) {
		return division;
	};
	
	Static.openArticle = function( obj ) {
		var f_size = parseInt($("#article-container").css("font-size"));
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
	
	function updateLayout( ) {
		$(window).ready(function( ) {
			var win = jQuery(window);
			win.resize(function( ) {
				var w = win.width(), h = win.height();
				var m = $('body').width(w).height(h)[0].resize;
				m && m(w, h);
			});
			$('body').trigger('resize');
		});
	}
	
	Static.main = function( ) {
		updateLayout();
		division = new Division({
			id : "main"
		});
		division.addTo(jQuery("body"));
		Taskbar.getInstance(callback);
		Events.getInstance();
		$("a").live('click', function( ) {
			window.open(this.href, '_blank');
			return false;
		});
		return false;
	};
	
	Static.parseRSS = function( url, callback, isGoogle ) {
		url = isGoogle ? document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent(url) : url;
		$.ajax({
		    url : url,
		    dataType : 'json',
		    success : function( data ) {
			    callback(data.responseData.feed);
		    }
		});
	};
};
fm.isConcatinated = false;
