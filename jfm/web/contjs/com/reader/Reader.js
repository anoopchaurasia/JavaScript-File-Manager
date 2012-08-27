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
fm.Package("com.reader.snippet");
fm.Import("com.reader.snippet.Snippet");
fm.Class("SnippetGroup", "jfm.html.Container");

com.reader.snippet.SnippetGroup = function (base, me, Snippet, Container) {
	
	var entries, f_size, counterPerColumn, currentSnippet;
	
	this.setMe = function( _me ) {
		me = _me;
	};
	
	this.SnippetGroup = function( resp, height, f_s) {
		entries = resp.entries, f_size = f_s;
		var len = resp.entries.length - 5;
		counterPerColumn = Math.floor( (height)/(Snippet.height + Snippet.margins)) - 1;
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
		currentSnippet = this.el.find(".newsSnippet:first")[0].jfm;
    };
    
    this.next = function(){

    	currentSnippet.deActivate();
    	if(!currentSnippet.next()){
    		return false;
    	}
    	currentSnippet = currentSnippet.next();
    	currentSnippet.activate();
    	return true;
    };
    
    this.prev = function(){

    	currentSnippet.deActivate();
    	if(!currentSnippet.prev()){
    		return false;
    	}
    	currentSnippet = currentSnippet.prev();
    	currentSnippet.activate();
    	return true;
    };
    
    this.up = function(){
    	
    	currentSnippet.deActivate();
    	if(!currentSnippet.el.parent().prev().length){
    		return false;
    	}
    	currentSnippet = currentSnippet.el.parent().prev().find("[indx='"+currentSnippet.el.attr('indx')+"']")[0].jfm;
    	currentSnippet.activate();
    	return true;
    };
    
    this.down = function(){
    	
    	currentSnippet.deActivate();
    	if(!currentSnippet.el.parent().next().length){
    		return false;
    	}
    	currentSnippet = currentSnippet.el.parent().next().find("[indx='"+currentSnippet.el.attr('indx')+"']")[0].jfm;
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
	function scrollIntoView(element) {
		  var containerLeft = me.el.scrollLeft(); 
		  var containerRight = containerTop + me.el.width(); 
		  var elemLeft = element.offsetLeft;
		  var elemRight = elemLeft + $(element).width(); 
		  if (elemLeft < containerLeft) {
		    $(container).scrollLeft(elemLeft);
		  } else if (elemRight > containerRight) {
			    me.el.scrollTop(elemRight - me.el.width());
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
	
	this.changeFont = function(change) {
		if(!active){
			return;
		}
		var f_size = parseInt(this.el.css("font-size")) + change;
		me.el.empty().css("font-size", f_size);
		this.create(f_size, true);
    };
};
fm.Package("com.reader.taskbar");
fm.Import("com.reader.snippet.AllSnippets");
fm.Import("com.reader.article.ArticleManager");
fm.Class("Taskbar", "jfm.html.Container");
com.reader.taskbar.Taskbar = function (base, me, AllSnippets, ArticleManager, Container) {
	this.setMe = function( _me ) {
		me = _me;
	};
	var self;
	var callback, singleton;
	
	Static.getInstance = function( cb ) {
		if (!singleton) {
			singleton = new me(cb);
		}
		return singleton;
	};
	
	Private.Taskbar = function( cb ) {
		callback = cb;
		self = this;
		base({
		    id : "taskbar",
		    height : 50,
		    html : jQuery("#taskbar-template").html()
		});
		com.reader.Reader.getDivision().bottom.add(this);
		$(".controlers .plus", this.el).click(increaseFontSize);
		$(".controlers .minus", this.el).click(decreaseFontSize);
		$(".home a", this.el).click(me.clickHome);
		$(">.news-feed-select a", this.el).click(changeSettings);
		var cont = jQuery("#hidden").html($("#setting-temp").html());
		getData(cont.find("form.news"));
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
		e.preventDefault();
		return false;
	}
	
	function getData( form ) {
		var arr = $(form).serializeArray();
		AllSnippets.getInstance().clearStoredData();
		for ( var k in arr) {
			com.reader.Reader.parseRSS(arr[k].value, callback, true);
		}
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
