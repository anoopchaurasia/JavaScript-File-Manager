/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

fm.Package("com.region");
fm.Import("jfm.html.Span");
fm.Import("com.post.Top");
fm.Import("jfm.html.Combobox");
fm.Class("Topbar", 'jfm.html.Container');
com.region.Topbar = function() {
	this.Topbar = function() {
		base({
			height : 70,
			css : {
				'background-color' : '#FCF0FE'
			}
		});
	};
	
	this.updateRegion = function(division) {
		this.add(new Container({
			html : "<a href='#'>Kerana</a>",
			'class': "logo"
		}));
		
		var states = new Combobox([], {
		    hintText : "Select State",
		    inputTabIndex : 6
		});
		
		Cache.getInstance().getTemplate('States', function( data ) {
			states.updateData(jQuery.parseJSON(data));
		});
		
		states.el.addClass("searchProduct");
		this.add(states);
	};
};