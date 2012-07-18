/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

fm.Import("jfm.division.Division");
fm.Import("jfm.query.QueryStr");
fm.Import("jfm.hash.HashChange");
fm.Import("com.region.Topbar");
fm.Class("App");
App = function( ) {
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
	Static.main = function() {
		
		updateLayout();
		var t2 = new Date().getTime();
		var d = new jfm.division.Division({
			id : "jfm-division"
		});
		var top = new Topbar();
		new jfm.hash.HashChange(d);
		
		if (QueryStr.getQuery("method") == 'verify') {
			location.hash = "registration";
		}
		
		top.updateRegion(d);
		d.top.add(top);
		d.addTo('body');
		console.log(new Date().getTime() - t, new Date().getTime() - t2);
	};
};
