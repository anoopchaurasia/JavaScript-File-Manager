fm.Package("com.reader.snippet");
fm.Import("com.reader.settings.Settings");
fm.Import("com.reader.snippet.AllSnippets");
fm.Class("LeftBar", "jfm.html.Container");
com.reader.snippet.LeftBar = function (base, me, Settings, AllSnippets, Container){this.setMe=function(_me){me=_me;};
	var singleton;
	Static.getInstance = function(){
		if(!singleton){
			singleton = new me();
		}
		return singleton;
	};
	this.active = function( ) {
		this.el.show();
	};
	
	this.isActive = function( ) {
		return active;
	};
	
	this.deActive = function( ) {
		this.el.hide();
	};
	
	this.create = function(callback){
		var data = Settings.getInstance().getData();
		var html = "<div>";
		for ( var k = 0; k < data.length; k++) {
			html += "<div class='items'><a href='" + data[k].url+ "'> " + data[k].name+ " </a> </div>";
		}
		html +="</div>";
		this.el.html(html);
		this.el.click(function(e) {
			e.preventDefault();
			if(e.target.nodeName == "DIV" && jQuery(e.target).hasClass("items") || e.target.nodeName == "A"){
				AllSnippets.getInstance().clearStoredData();
				com.reader.Reader.parseRSS(e.target.childNodes[0].href, callback, true);
			}
			if( e.target.nodeName == "A" ){
				AllSnippets.getInstance().clearStoredData();
				com.reader.Reader.parseRSS(e.target.href, callback, true);
			}
			return false;
        });
	};
	
	this.Private.LeftBar = function() {
		base({
			width:150,
			height: "100%"
		});
    };
};