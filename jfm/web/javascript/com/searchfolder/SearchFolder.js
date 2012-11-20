fm.Package("com.searchfolder");
fm.Import("jfm.server.Server");
fm.Class("SearchFolder","jfm.html.Container");
com.searchfolder.SearchFolder = function(base, me, Server, Container) {
	this.setMe = function(_me){me=_me;};
	Static.main = function(){
		updateLayout();
		new me();
	};
	
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
	
	function createList(resp){
		console.log(resp);
		var html="<ul>";
		for ( var i = 0; i < resp.length; i++) {
			 html += "<li><a target='_blank' href='/download" + resp[i] +"?method=download' >" + resp[i] + "</a>";
		}
		html += "</ul>";
		me.el.find(".result").html(html);
	}
	
	function getApplist() {
		val = this.value.trim();
		if(val.length <2){
			me.el.find(".result").empty();
			return;
		}
		Server.getInstance("/download/").serviceCall({name:val}, "getFileList", function(resp){
			createList(resp);
		});
	}
	
	this.SearchFolder = function(){
		base($("#main"));
		this.el.width("100%").height("100%");
		$("input", this.el).keyup(getApplist);
	};
};