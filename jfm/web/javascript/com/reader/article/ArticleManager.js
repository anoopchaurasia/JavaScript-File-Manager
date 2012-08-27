fm.Package("com.reader.article");
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
