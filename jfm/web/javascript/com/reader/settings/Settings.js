fm.Package("com.reader.settings");
fm.Import("jfm.cookie.Cookie");
fm.Class("Settings", "jfm.html.Container");
com.reader.settings.Settings = function (base, me, Cookie, Container) {
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
		Cookie.set("color", $("#foreground-color", this).val());
		Cookie.set("bgcolor", $("#background-color", this).val());
		$("body").css({
		    'background-color' : "#" + $("#background-color", this).val(),
		    'color' : "#" + $("#foreground-color", this).val()
		});
		return false;
		
	}
	
	this.disable = function( ) {
		
		this.el.hide();
	};
	this.enable = function( ) {
		
		this.el.show();
	};
	this.getData = function( ) {
		return data;
	};
	this.Settings = function( ) {
		
		var bgColor = Cookie.get("bgcolor"),
		color = Cookie.get("color");
		if(!bgColor){
			Cookie.set("bgcolor", (bgColor = "ffffff"));
			Cookie.set("color", color = "000000");
		}
		document.body.style.backgroundColor = "#" + bgColor;
		document.body.style.color = "#" + color;
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
		}, {
		    url : "http://www.engadget.com/editor/brian-heater/rss.xml",
		    name : "Engadget"
		}, {
		    url : "http://feeds.feedburner.com/liveside",
		    name : "liveside"
		}, {
		    url : "http://feeds.slashgear.com/slashgear",
		    name : "Slashgear"
		}, {
		    url : "http://feeds.feedburner.com/TechCrunch/",
		    selected : true,
		    name : "Tech Crunch"
		} ];
	};
	this.changeSettings = function( cb ) {
		callback = cb;
		var html = "<div style='float:left;'>";
		for ( var k = 0; k < data.length; k++) {
			html += "<div class='items'><label><input name='" + data[k].name + "' value=' " + data[k].url + "' type='checkbox'/>&nbsp;&nbsp;&nbsp;&nbsp;" + data[k].name + "</label></div>";
		}
		html += "<div class='items'><input class='addfeedURL textinput' type='text' value='' placeholder='feed url' /> <button class='addUrl'>Add</button></div>";
		html += "<div class='items'><input type='submit' value='Save' /> </div></div>";
		html += "<div style='float:left;'><table>";
		html += "<tr><td>Background-Color:</td><td> <input id='background-color' class=textinput value=" + Cookie.get("bgcolor") + " /></td></tr>";
		html += "<tr><td>Color:</td> <td><input id='foreground-color' class=textinput value=" + Cookie.get("color") + " /></td></tr>";
		html += "</table></div>";
		this.el.find("form").html(html);
		this.el.parent().scrollLeft(0);
		this.el.find("form .addUrl").click(function( ) {
			var url = jQuery(this).prev().val();
			saveUrl(url, cb);
		});
	};
	function saveUrl( url ) {
		data.push({
		    url : url,
		    selected : true,
		    name : "added"
		});
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
