fm.Package("com.reader.article");
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
		    height : height - 10,
		    'class' : "imageContainer selector parent"
		});		
		this.add(addImage(images[0]) );
	};
	
	function addImage(img) {
		return new Container({
			  width : "100%",
			    height:255,
			    "class" : "image-container",
			    html : "<img  src='" + img.href + "'/><div class='imagetext'>" + img.text + "</div>"
		});
	}
	
	this.getWidth = function() {
		return imageContainerWidth? imageContainerWidth + 20 : 0;
    };
	
	this.getColumns = function() {
		return contentColumns;
	};
	
	this.getSingleColumnWidth = function() {
		return columnInsideImageWidth;
	};
};