fm.Package("com.reader.article");
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
	var columnsInfo, currentCoNumber;
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
		columnsInfo = jQuery("#columnsInfo");
		c.add(this);
		Cookie.get("Afontsize") && this.el.css('font-size', Cookie.get("Afontsize") + "px");
		setTimeOut = -9;
		multi = 18;
		active = false;
		margins = 20;
		currentCoNumber = 1;
		this.imageHeight = 400;
		c.resize(this.resize);
	};
	this.next = function( ) {
		if (!active) {
			return;
		}
		
		if (currentSelected.next().length != 0) {
			currentSelected.removeClass("column-selected");
			currentSelected = currentSelected.next().addClass("column-selected");
			scrollIntoView(currentSelected.get(0));
		}
		else {
			this.el.parent().scrollLeft(this.el.width());
			return;
		}
		currentCoNumber++;
		jQuery(".current",columnsInfo).html(currentCoNumber);
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
		
		if (currentSelected.prev(".selector").length != 0) {
			currentSelected.removeClass("column-selected");
			currentSelected = currentSelected.prev().addClass("column-selected");
			scrollIntoView(currentSelected.get(0));
		}
		else {
			this.el.parent().scrollLeft(0);
			return;
		}
		currentCoNumber--;
		jQuery(".current",columnsInfo).html(currentCoNumber);
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
		return {
			height:0,
			width:0
		};
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
		columnsInfo.show();
		this.el.show();
	};
	
	this.deActive = function( ) {
		active = false;
		columnsInfo.hide();
		this.el.hide();
	};
	
	this.isActive = function( ) {
		return active;
	};
	
	function prepareHtml( ) {
		if (!self.imgInfo) {
			self.imgInfo = [];
			self.imgInfo = $("#hidden >.content").find("img").clone();
//			var imgi = {};
//			for ( var i = 0; i < imgsInfo.length; i++) {
//				imgi = {};
//				imgi.href = $("img", imgsInfo[i]).attr("src");
//				imgi.height = $("img", imgsInfo[i]).height();
//				imgi.text = $(imgsInfo[i]).text();
//				self.imgInfo.push(imgi);
//			}
		}
		$("#hidden").find("*").filter(function( ) {
			return this.tagName.toLowerCase() != 'br' && this.tagName.toLowerCase() != 'img' && $.trim($(this).text()) == '';
		}).remove();
		self.imgages = $("#hidden >.content").find("*").width('').height('').find("img");
		$("#hidden >.content").find("img").parent().not(".content").remove();
		$("#hidden >.content").find("img").remove();
		$("#hidden >.content").find(">br, script").remove();
		self.content = $.trim($("#hidden >.content").html().replace(/[\s\s]+|\n+/, " ").replace(/\r\n|\sstyle=""|^\s/gim, ""));
		self.htmlLength = self.content.length;
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
		if(!active){
			return;
		}
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
		currentCoNumber = 1;
		prepareHtml();
		jQuery(".current",columnsInfo).html(currentCoNumber);
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
			jQuery(".total",columnsInfo).html(i);
			var elem;
			//alert("a");
			articleContainer.width((i - columns) * (articalWidth + margins) + imageContainer.getWidth());
			if (i <= columns) {
				removeHeight += imageContainer.el.find(".image-container").height() + margins;
				elem = $(htm).appendTo(imageContainer.el).removeClass("parent").addClass("text-inside-image");
				elem.find("div.s").height(bodyHeight - removeHeight).width(imageContainer.getSingleColumnWidth());
			}
			else {
				elem = $(htm).appendTo(articleContainer);
				elem.find("div.s").height(bodyHeight - removeHeight -10).width(articalWidth);
			}
			
			trancatedLength = content.truncateWithHeight(elem.find("div.s"), trancatedLength[0], self.content);
			setTimeOut = setTimeout(recursive, 10);
			//alert( i + "");
		}
		recursive();
		//alert("a");

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
