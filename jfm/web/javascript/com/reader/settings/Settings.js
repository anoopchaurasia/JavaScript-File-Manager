fm.Package("com.reader.settings");
fm.Class("Settings", "jfm.html.Container");
com.reader.settings.Settings = function( base, me, Container ) {
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
		    url : "http://feeds.mashable.com/Mashable",
		    name : "Mashable"
		}, {
		    url : "http://feeds.feedburner.com/fakingnews",
		    name : "Faking News",
		}, {
		    url : "http://blogs.forbes.com/ewanspence/feed/",
		    name : "Ewan Spence"
		},{
			url: "http://www.engadget.com/editor/brian-heater/rss.xml",
			name: "Engadget"
		},{
			url: "http://feeds.feedburner.com/liveside",
			name: "liveside"
		},{
			url: "http://feeds.slashgear.com/slashgear",
			name : "Slashgear"
		},{
			url: "http://feeds.feedburner.com/TechCrunch/",
			selected : true,
			name : "Tech Crunch"
		}
		];
	};
	this.changeSettings = function( cb ) {
		callback = cb;
		var html = "";
		for ( var k = 0; k < data.length; k++) {
			html += "<div class='items'><label><input name='" + data[k].name + "' value=' " + data[k].url + "' type='checkbox'/>&nbsp;&nbsp;&nbsp;&nbsp;" + data[k].name + "</label></div>";
		}
		html +="<div class='items'><input type='text' value='' placeholder='url' /> <button class='addUrl'>Add</button></div>";
		html += "<div class='items'><input type='submit' value='Save' /> </div>";
		this.el.find("form").html(html);
		this.el.find("form .addUrl").click(function(){
			var url = jQuery(this).prev().val();
			saveUrl (url, cb);
		});
	};
	function saveUrl(url) {
		data.push({url:url,selected:true, name:"added"});
		me.changeSettings(callback);
    }
	this.getSelectedUrl = function( cb ) {
		for ( var k = 0; k < data.length; k++) {
			if (data[k].selected) {
				cb(data[k].url);
			}
		}
		return "";
	};
};
