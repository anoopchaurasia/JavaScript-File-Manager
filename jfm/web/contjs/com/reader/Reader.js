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
	
	this.onClick = function( ) {
		this.el.click(function( ) {
			com.reader.Reader.openArticle(me);
		});
	};
	
	this.Snippet = function( nb, f_size, index ) {
		$.extend(true, this, nb);
		base({
		    "class" : 'newsSnippet',
		    height: this.height,
		    index : index,
		    html : this.getTitle() + this.getImage() + this.getBody(),
		    css : {
			    width : (f_size) * ( f_size)
		    }
		});
		this.onClick();
	};
};
fm.Package("com.reader.snippet");
fm.Import("com.reader.snippet.Snippet");
fm.Class("SnippetGroup", "jfm.html.Container");

com.reader.snippet.SnippetGroup = function (base, me, Snippet, Container) {
	
	var entries, f_size, counterPerColumn, currentSnippet;
	
	this.setMe = function( _me ) {
		me = _me;
	};
	
	this.SnippetGroup = function( resp, height, f_s) {
		entries = resp.entries, f_size = (Snippet.widthAmlifier + f_s);
		var len = resp.entries.length - 5;
		counterPerColumn = Math.floor( height/Snippet.height) - 1;
		var columns = Math.ceil(len / counterPerColumn);
		base({
		    'class' : 'item-item-cont',
		    html : "<h2>" + resp.title + "</h2>",
		    css : {
		        width : (f_size * f_size + Snippet.margins) * columns,
		        height : "100%"
		    }
		});
	};
	
	this.addSnippets = function(  ) {
		
		var k = -1,len = entries.length - 5, firstSnipptes;
		var h = Math.ceil(len / counterPerColumn);
		function recursive( ) {
			if (k == len - 1) {
				return;
			}
			k++;
			var bf = new Snippet(entries[k], f_size, k % h);
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
		currentSnippet = this.el.find(".newsSnippet:first");
    };
    
    this.next = function(){

    	currentSnippet.removeClass("selected");
    	if(!currentSnippet.next()){
    		return false;
    	}
    	currentSnippet = currentSnippet.next();
    	currentSnippet.addClass("selected");
    	return true;
    };
    
    this.prev = function(){

    	currentSnippet.removeClass("selected");
    	if(!currentSnippet.prev()){
    		return false;
    	}
    	currentSnippet = currentSnippet.prev();
    	currentSnippet.addClass("selected");
    	return true;
    };
    
    this.up = function(){
    	
    	currentSnippet.removeClass("selected");
    	if(!currentSnippet.parent().prev()){
    		return false;
    	}
    	currentSnippet = currentSnippet.parent().prev().find("[index='"+currentSnippet.attr('index')+"']");
    	currentSnippet.addClass("selected");
    	return true;
    };
    
    this.up = function(){
    	
    	currentSnippet.removeClass("selected");
    	if(!currentSnippet.parent().next()){
    		return false;
    	}
    	currentSnippet = currentSnippet.parent().next().find("[index='"+currentSnippet.attr('index')+"']");
    	currentSnippet.addClass("selected");
    	return true;
    };
};
fm.Package("com.reader.snippet");
fm.Import("com.reader.snippet.SnippetGroup");
fm.Class("AllSnippets", "jfm.html.Container");
com.reader.snippet.AllSnippets = function (base, me, SnippetGroup, Container) {
	this.setMe = function( _me ) {
		me = _me;
	};
	var firstSnipptes, active;
	var currentSelectedSnippet;
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
		firstSnipptes = null;
		active = false;
	};
	
	this.clearStoredData = function( ) {
		this.el.empty();
		totalWidth = 0;
		firstSnipptes = null;
		currentSelectedSnippet = null;
	};
	
	this.active = function( ) {
		this.el.show().siblings().hide();
		active = true;
		if (currentSelectedSnippet) {
			currentSelectedSnippet[0].scrollIntoView(false);
		}
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
		var snippetGroup = new SnippetGroup(resp, this.el.height(), f_size);
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
		currentGroup.next();		
	};
	
	this.prev = function( ) {
		if (!active) {
			return;
		}
		currentGroup.prev();	
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
		if (currentSelectedSnippet) {
			currentSelectedSnippet.removeClass("selected");
		}
	};
	this.showArticle = function( ) {
		if (active) {
			currentSelectedSnippet.trigger("click");
		}
	};
	this.resize = function( f_size ) {
		var totalWidth = 0;
		$(".item-item-cont", this.el).each(function( ) {
			var allsnips = $(".newsSnippet", this);
			allsnips.width(f_size * f_size);
			var cols = Math.ceil(allsnips.length / 3);
			$(this).width((allsnips.width() + 17) * cols + 20);
			totalWidth += (allsnips.width() + 17) * cols + 20 + 40;
		});
		this.el.width(totalWidth);
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
fm.Import("com.reader.filler.FillContent");
fm.Class("ArticleManager", "jfm.html.Container");
com.reader.article.ArticleManager = function (base, me, FillContent, Container) {
	this.setMe = function( _me ) {
		me = _me;
	};
	var setTimeOut, multi, currentSelected, active, singleton;
	this.bodyHeight;
	var margins;
	this.articalWidth;
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
	Private.ArticleManager = function( ) {
		base({
			id : "article-container"
		});
		com.reader.Reader.getDivision().center.add(this);
		this.bodyHeight = $("#main").height();
		setTimeOut = -9;
		multi = 18;
		active = false;
		margins = 36;
		this.imageHeight = 400;
		this.imageContainerWidth = 500;
	};
	this.next = function( ) {
		if (!active) {
			return;
		}
		if (!currentSelected.hasClass("column-selected")) {
			currentSelected.addClass("column-selected");
			currentSelected.get(0).scrollIntoView(false);
			return;
		}
		
		if (currentSelected.next().length != 0) {
			currentSelected.removeClass("column-selected");
			currentSelected = currentSelected.next().addClass("column-selected");
			currentSelected.get(0).scrollIntoView(false);
			changed({
				type : "next"
			});
		}
		else {
			this.el.parent().scrollLeft(this.el.width());
		}
	};
	
	this.prev = function( ) {
		if (!active) {
			return;
		}
		if (!currentSelected.hasClass("column-selected")) {
			currentSelected.addClass("column-selected");
			currentSelected.get(0).scrollIntoView(false);
			
			return;
		}
		if (currentSelected.prev(".selector").length != 0) {
			currentSelected.removeClass("column-selected");
			currentSelected = currentSelected.prev().addClass("column-selected");
			currentSelected.get(0).scrollIntoView(false);
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
		}).appendTo(self.el);
		return {
		    height : div.height(),
		    width : div.width()
		};
	}
	
	function getImageContainer( ) {
		return $("<div />", {
		    width : "90%",
		    "class" : "image-container",
		    html : "<img  src='" + self.imgInfo[0].href + "'/><div class='imagetext'>" + self.imgInfo[0].text + "</div>"
		});
	}
	function createImageGallary( f_size, height ) {
		if (self.imgInfo.length == 0 || $.trim(self.imgInfo[0].text) == "") {
			return 0;
		}
		var columnWidth = f_size * multi + margins;
		var columns = self.imageContainerWidth / columnWidth;
		if (columns - 1 > .7) {
			columns = 2;
		}
		else {
			columns = 1;
		}
		self.columnInsideImageWidth = Math.floor(self.imageContainerWidth / columns - margins / 2 - 2);
		self.numberofEffectedImage = columns;
		self.imageContainer = $("<div />", {
		    width : self.imageContainerWidth,
		    height : height,
		    'class' : "imageContainer selector parent"
		}).appendTo(self.el);
		self.imageContainer.append(getImageContainer());
		return columns;
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
	;
	
	this.create = function( f_size, isTaskbar ) {
		if (!isTaskbar) {
			self.imgInfo = undefined;
		}
		this.articalWidth = f_size * multi;
		var articleContainer = this.el.empty();
		var trancatedLength = [ 0, 1 ];
		var htm = "<div class='parent selector'><div class='s'></div></div>";
		if (setTimeOut) {
			clearTimeout(setTimeOut);
		}
		prepareHtml();
		var content = new FillContent(this.content);
		var header = createHeader(this.title);
		var numbers = createImageGallary(f_size, self.bodyHeight - 90 - header.height);
		var i = 0;
		function recursive( ) {
			var removeHeight = 90 + header.height;
			if (trancatedLength[1] <= 0) {
				return;
			}
			i++;
			var elem;
			articleContainer.width(i * (self.articalWidth + margins) + self.imageContainerWidth + margins);
			if (i <= numbers) {
				removeHeight += self.imageContainer.find(".image-container").height();
				elem = $(htm).appendTo(self.imageContainer).removeClass("parent").addClass("text-inside-image");
				elem.find("div.s").height(self.bodyHeight - removeHeight).width(self.columnInsideImageWidth);
			}
			else {
				elem = $(htm).appendTo(articleContainer);
				elem.find("div.s").height(self.bodyHeight - removeHeight).width(self.articalWidth);
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
};
/**
 * Created with JetBrains WebStorm.
 * User: anoop
 * Date: 5/12/12
 * Time: 2:54 AM
 * To change this template use File | Settings | File Templates.
 */
fm.Package("jfm.lang");
fm.Class("Character");
jfm.lang.Character = function (me){this.setMe=function(_me){me=_me;};


    this.shortHand = "Character";
    Static.Const = {
        UTF_CHAR : /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        CHARS : {
            '\b' : '\\b',
            '\t' : '\\t',
            '\n' : '\\n',
            '\f' : '\\f',
            '\r' : '\\r',
            '"' : '\\"',
            '\\' : '\\\\'
        },
        rCRLF : /\r?\n/g,
        EMPTY : "",
        OPEN_O : '{',
        CLOSE_O : '}',
        OPEN_A : '[',
        CLOSE_A : ']',
        COMMA : ',',
        COMMA_CR : ",\n",
        CR : "\n",
        COLON : ':',
        COLON_SP : ': ',
        QUOTE : '"'        
    };
    Static.Const.keys = {
        BACKSPACE: 8,
        TAB: 9,
        ENTER: 13,
        SHIFT: 16,
        CTRL: 17,
        ALT: 18,
        BREAK: 19,
        CAPSLOCK: 20,
        ESCAPE: 27,
        PAGEUP: 33,
        PAGEDOWN: 34,
        END: 35,
        HOME: 36,
        LEFTARROW: 37,
        UPARROW: 38,
        RIGHTARROW: 39,
        DOWNARROW: 40,
        INSERT: 45,
        DELETE: 46,
        ZERO: 48,
        ONE: 49,
        TWO: 50,
        THREE: 51,
        FOUR: 52,
        FIVE: 53,
        SIX: 54,
        SEVEN: 55,
        EIGHT: 56,
        NINE: 57,
        A: 65,
        B: 66,
        C: 67,
        D: 68,
        E: 69,
        F: 70,
        G: 71,
        H: 72,
        I: 73,
        J: 74,
        K: 75,
        L: 76,
        M: 77,
        N: 78,
        O: 79,
        P: 80,
        Q: 81,
        R: 82,
        S: 83,
        T: 84,
        U: 85,
        V: 86,
        W: 87,
        X: 88,
        Y: 89,
        Z: 90,
        LEFT_WINDOW_KEY:91,
        RIGHT_WINDOW_KEY: 92,
        SELECT_KEY: 93,
        MULTIPLY: 106,
        ADD: 107,
        SUBTRACT: 109,
        DECIMAL_POINT: 110,
        DIVIDE: 111,
        F1: 112,
        F2: 113,
        F3: 114,
        F4: 115,
        F5: 116,
        F6: 117,
        F7: 118,
        F8: 119,
        F9: 120,
        F10: 121,
        F11: 122,
        F12: 123,
        NUM_LOCK: 144,
        SCROLLLOCK: 145,
        SEMICOLON: 186,
        EQUAL: 187,
        COMMA: 188,
        DASH: 189,
        PERIOD: 190,
        FORWARDSLASH: 191,
        GRAVEACCENT: 192,
        OPENBRACKET: 219,
        BACKSLASH: 220,
        CLOSEBRAKET: 221,
        SINGLEQUOTE: 222
    }   
};

/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
fm.Package("jfm.html");
fm.Class("Img");
jfm.html.Img = function (me){this.setMe=function(_me){me=_me;};
    
    this.shortHand = "Img";
    this.init = function(){
        var config = Static.config  = {};
        config["class"] = "jfm-icon";
    };
    
    this.Img = function(config){
        if( typeof config == 'string'){
            config = {
                src : config
            };
        }
        config["class"] = Component.getCSSClass(config['class'], this.config['class']);
        if(config.src){
            this.el = jQuery('<img/>' , config);
        }else{
            this.el = jQuery('<span/>' , config);
        }
    };
};


/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
fm.Package("jfm.html");
fm.Class("Span");
jfm.html.Span = function (me){this.setMe=function(_me){me=_me;};
    
    this.shortHand = "Span";
    this.init = function(){
        var config = Static.config  = {};
        config["class"] = " jfm-text";
    };
    
    this.Span = function(config){
       if( typeof config == 'string'){
            var t= config;
            config = {};
            config.text = t;
        }
        config["class"] = Component.getCSSClass(config["class"], this.config['class']);
        this.el = jQuery('<span/>' , config);
    }; 
   
};

//jfm.html.Span.prototype = jQuery.prototype;





/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
fm.Package("jfm.html");
fm.Import("jfm.lang.Character");
fm.Import("jfm.html.Img");
fm.Import("jfm.html.Span");
fm.Class("Popup", "jfm.html.Container");
jfm.html.Popup = function (base, me, Character, Img, Span, Container){this.setMe=function(_me){me=_me;};
    
    this.shortHand = "Popup";
    var pHead, pBody, pClose, callback, singleton;
    var me = this;    
    this.Private.Popup = function(cb){
        callback = cb;
        var Top = document.documentElement.scrollTop,
        Left = document.documentElement.scrollLeft + 100;
        var config = {
            'class':"jfm-popup",
            css:{
                top:Top,
                left:Left,
                display:'none'
            }
        };
        base(config);
        pBody = new Container({
            'class':"jfm-body"
        });
        pHead = new Container({
            'class':"jfm-head unselectable"
        });
        pClose = new Img({
            'class':"jfm-close", 
            src:"img/close-button.jpg",
            width:'auto',
            height:'auto'
        }); 
        this.add([pClose, pHead, pBody]);
        pClose.el.bind('click',function(){
            me.hide();
        });
        this.method('keyup',function (e) {
            if (e.keyCode == Character.keys.ESCAPE) {
                me.hide();
            }
        });
        this.el.appendTo('body');
    };
    Static.getInstance = function(){
        if(!singleton){
            singleton = new jfm.html.Popup();
        }
        return singleton;
    };
        
    this.pBody = function(elem){
        pBody.el.empty();
        pBody.add(elem);
        return  pBody.el.children();
    };
    
    
    this.hide = function (){    	
        this.el.hide();
        if (callback) callback();
        return true;
    };
    
    this.pHead = function(elem) {
        pHead.el.empty().show().width(pBody.el.width());
        pHead.add(elem);       
        return pHead;
    };
    
    this.getContainer = function(){
        return pBody.el.children();
    };
    
    this.show = function (leftMargin, topMargin) {

        this.updateLayout(leftMargin, topMargin);
        this.el.fadeIn(250,function(){
            pHead.el.width(pBody.el.width());
        });
        this.el.trigger("focus");
    };
    
    this.updateLayout = function(leftMargin, topMargin){
       
        var width = parseInt(this.el.css("width"),10),
        height = parseInt(this.el.css("height"),10),
        top = $(document).scrollTop(),
        left =$(document).scrollLeft(),
        screenWidth = $(window).width() - 10,
        screenHeight = $(window).height() - 24;
        if(isNaN(width)) width = this.el.width();
        if(isNaN(height))height = this.el.height();
        left = left + (screenWidth - width) / 2;            
        top = (screenHeight - height) > 0 ? top + (screenHeight - height) / 2 : top;
        leftMargin = leftMargin?leftMargin:0;
        topMargin = topMargin?topMargin:10;
        this.el.css({
            top: top+topMargin,
            left: left +leftMargin
        });
        pHead.el.width(pBody.el.width());
    };
    
    this.showHint = function(el){        
       
        var span = new Span({text:el.attr('hintText'), css:{'text-align':'right', color:'#666'}});
        span.el.width(el.width() + 20).height(el.height() -3).css("margin-top",'3px');
        this.pBody(span.el);
        pBody.el.css("margin",0);
        pHead.el.hide();        
        pClose.el.hide();
        var left =  el.position().left - el.width() - 30, top =  el.position().top;
        this.el.css({left:left, top: top,"padding":"0","margin":"0"});
        this.el.show();
    };
    
    this.hideHint = function(){
        pBody.el.css("margin",'');
        this.el.css({"padding":"","margin":""});
        this.hide();
    };
};


fm.Package("com.reader.taskbar");
fm.Import("jfm.html.Popup");
fm.Import("com.reader.snippet.AllSnippets");
fm.Import("com.reader.article.ArticleManager");
fm.Class("Taskbar", "jfm.html.Container");
com.reader.taskbar.Taskbar = function (base, me, Popup, AllSnippets, ArticleManager, Container){this.setMe=function(_me){me=_me;};
	var self;
	var callback, singleton;
	
	Static.getInstance = function(cb){
		if(!singleton){
			singleton = new me(cb);
		}
		return singleton;
	};
	
	Private.Taskbar = function(cb) {
		callback = cb;
		self = this;
		base(jQuery("#taskbar"));
		$(".controlers .plus", this.el).click(increaseFontSize);
		$(".controlers .minus", this.el).click(decreaseFontSize);
		
		$(".home a", this.el).click(function(){
			self.clickHome();
			return false;
		});
		
		ArticleManager.getInstance().registerChange(columnChange);
		$(".show-column a", this.el).click(function() {
			self.showOnlyColumn();
			return false;
		});
		
		$(">.news-feed-select a", this.el).click(changeSettings);   
		var popup = Popup.getInstance();
		var cont = popup.pBody( $("#setting-temp").html() );
		getData( cont.find("form.news") );
		popup.hide();
	};
	function increaseFontSize(){
		if( ArticleManager.getInstance().isActive()){
    		var f_size = parseInt( $("#article-container").css("font-size")) + 2;
	    	$("#article-container").css("font-size",  f_size);
	    	ArticleManager.getInstance().create( f_size, true );
		}
		if( AllSnippets.getInstance().isActive()){
			var f_size = parseInt( $("#article-list").css("font-size")) + 2;
	    	$("#article-list").css("font-size",  f_size);
	    	AllSnippets.getInstance().resize(   f_size );
		}
		return false;
	}
	function decreaseFontSize(){
    	if( ArticleManager.getInstance().isActive()){
	    	var f_size = parseInt( $("#article-container").css("font-size")) - 2;
	    	$("#article-container").css("font-size", f_size );
	    	ArticleManager.getInstance().create( f_size, true );
    	}
    	if(AllSnippets.getInstance().isActive()){
    		var f_size = parseInt( $("#article-list").css("font-size")) - 2;
	    	$("#article-list").css("font-size",  f_size);
	    	AllSnippets.getInstance().resize(   f_size );
    	} return false;
    }
	this.register = function() {
		
	};
	
	function createTabbing( cont) {
		var leftPanel = $(".left-panel",cont);
		var rightPanel = $(".right-panel", cont);
		var tabBody = rightPanel.find(".tab-body");
		var tabs = leftPanel.find(".tab-head");
		tabs.click(function(){
			var href = $("a",this).get(0).href;
			href= href.substring(href.indexOf("#")+1);
			tabBody.hide();
			tabBody.filter(function() {
				 if($(this).hasClass(href)){ return this; };
			}).show();
			return false;
		});
	}
	function changeSettings() {
    	//$taskbar.find(".settings-content").show();
    	var popup = new Popup();
    	var cont = popup.pBody( $("#setting-temp").html() );
    	createTabbing( cont );
    	if($("#icp_background").length == 0 ){
    		iColorPicker();
    	}
    	popup.makeItMiddle( 0, -50);
    	cont.find("form.news").submit(function() {
    		getData( this );
    		$("#setting-temp").html(cont.parent().html());
    		popup.hide();
		    return false;
		});
    	cont.find("form.color").submit(function() {
    		$("body").css({ "color" : this.color.value, "background-color" : this.background.value });
    		$("#setting-temp").html(cont.parent().html());
    		popup.hide();
		    return false;
		});
    }
	
	function getData( form ) {
   	 var arr = $( form ).serializeArray();
   	AllSnippets.getInstance().clearStoredData();
    	for(var k in arr ){
    		parseRSS( arr[k].value, callback, true);
    	}
     }       
	
	function columnChange() {
		if(!popup){
			return;
		}
		var cont = popup.pBody( ArticleManager.getInstance().getSelectedColumn() );
		cont.css('font-size', ArticleManager.getInstance().getSelectedFontSize());
		popup.makeItMiddle(0,-40);
	}
	var popup;
	this.showOnlyColumn = function()
	{
		popup = Popup.getInstance(function(){	popup = undefined;
		});
		var cont = popup.pBody( ArticleManager.getInstance().getSelectedColumn() );
		cont.css('font-size', ArticleManager.getInstance().getSelectedFontSize());
		popup.addBGClass("blackBG");
		popup.addClass("whiteBG");
		popup.makeItMiddle(0,-40);
	};
    this.clickHome = function() {
    	if(!AllSnippets.getInstance().isActive()){
    		AllSnippets.getInstance().active();
	    	ArticleManager.getInstance().deActive();
	    	if(popup){
	    		popup.hide();
	    		popup = undefined;
	    	}
    	}
    	
	};
}; 
fm.Package("jfm.division");
fm.Class("Part","jfm.component.Component");
jfm.division.Part = function (base, me, Component){this.setMe=function(_me){me=_me;};

    var set, division;    
    this.Part = function(config, divsn, s){
        set = s;
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
	
	var isAlreadyset;
	this.updateLayout = function( ) {
		var h = getRemainingHeight();
		var w = getRemainingWidth();
		me.top && me.top.el.width(width);
		me.bottom && me.bottom.el.width(width);
		me.left && me.left.el.height(h);
		me.right && me.right.el.height(h);
		var m = me.center && me.center.el.height(h).width(w)[0].resize;
		m && m(w, h);
		me.center.el.css("overflow", 'hidden');
		if (isAlreadyset) {
			clearTimeout(isAlreadyset);
		}
		isAlreadyset = setTimeout(function( ) {
			isAlreadyset = 0;
			me.center.el.css("overflow", '');
		}, 800);
	};
	
	function set( obj, appender, difW, difH ) {
		if (obj && obj.instanceOf && obj.el instanceof jQuery) {
			// TODO
		}
		else {
			obj = new Container(obj);
		}
		difH && appender.el.height(difH);
		appender.el.show()
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
com.reader.events.Events = function (me, AllSnippets, ArticleManager, Taskbar){this.setMe=function(_me){me=_me;};
	var singleton;
	
	
	Static.getInstance = function(){
		if(!singleton){
			singleton = new me();
		}
		return singleton;
	};

	Private.Events = function( ) {};
	
	this.keyupEvents = function( ) {
		$(document).keyup(function( e ) {
			switch (e.keyCode) {
				case 13: {
					AllSnippets.getInstance().showArticle();
					break;
				}
				case 36: {
					Taskbar.getInstance().clickHome();
					break;
				}
				case 8: {
					if (!AllSnippets.getInstance().isActive()) {
						Taskbar.getInstance().clickHome();
						return false;
					}
					break;
				}
			}
			return false;
		});
	};
	
	this.keydownEvents = function( ) {
		
		$(".left-navigation", Taskbar.getInstance().el).mousedown(function( ) {
			AllSnippets.getInstance().prev();
			ArticleManager.getInstance().prev();
		});
		$(".up-navigation", Taskbar.getInstance().el).mousedown(function( ) {
			AllSnippets.getInstance().up();
		});
		$(".right-navigation", Taskbar.getInstance().el).mousedown(function( ) {
			AllSnippets.getInstance().next();
			ArticleManager.getInstance().next();
		});
		$(".down-navigation", Taskbar.getInstance().el).mousedown(function( ) {
			AllSnippets.getInstance().down();
		});
		$(document).keydown(function( e ) {
			switch (e.keyCode) {
				
				case 39: {
					AllSnippets.getInstance().next();
					ArticleManager.getInstance().next();
					return false;
					break;
				}
				case 37: {
					AllSnippets.getInstance().prev();
					ArticleManager.getInstance().prev();
					return false;
					break;
				}
				case 38: {
					AllSnippets.getInstance().up();
					ArticleManager.getInstance().removeHighLight();
					return false;
					break;
				}
				case 40: {
					AllSnippets.getInstance().down();
					ArticleManager.getInstance().removeHighLight();
					return false;
					break;
				}
				default: {
					AllSnippets.getInstance().removeHighLight();
					ArticleManager.getInstance().removeHighLight();
					return false;
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
	Static.getDivision = function() {
		return division;
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
	Static.main = function( ) {
		updateLayout();
		division = new Division({
			id: "main"
		});
		division.addTo(jQuery("body"));
		Taskbar.getInstance(callback);
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
fm.isConcatinated = false;
