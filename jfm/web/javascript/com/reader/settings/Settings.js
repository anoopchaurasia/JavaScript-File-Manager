fm.Package("com.reader.settings");
fm.Class("Settings", "jfm.html.Container");
com.reader.settings.Settings = function(base, me, Container) {
	this.setMe = function(_me) {
		me = _me;
	};
	var data, singleton, callback;

	Static.getInstance = function(cb) {
		if (!singleton) {
			singleton = new me(cb);
		}
		return singleton;
	};

	function submit() {
		var arr = $(this).serializeArray();
		for ( var k in arr) {
			callback(arr[k].value);
		}
		return false;
	}

	this.disable = function() {

		this.el.hide();
	};
	this.enable = function() {

		this.el.show();
	};
	this.Settings = function() {
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
		}, {
			url : "http://online.wsj.com/xml/rss/3_7011.xml",
			name : "abcd",
			selected : true
		} ];
	};
	this.changeSettings = function(cb) {
		callback = cb;
		var html = "";
		for ( var k = 0; k < data.length; k++) {
			html += "<div class='items'><label><input name='" + data[k].name + "' value=' " + data[k].url + "' type='checkbox'/>&nbsp;&nbsp;&nbsp;&nbsp;"
					+ data[k].name + "</label></div>";
		}
		html += "<div class='items'><input type='submit' value='Save' /> </div>";
		this.el.find("form").html(html);
	};

	this.getSelectedUrl = function() {
		for ( var k = 0; k < data.length; k++) {
			if (data[k].selected) {
				return data[k].url;
			}
		}
		return "";
	};
};
