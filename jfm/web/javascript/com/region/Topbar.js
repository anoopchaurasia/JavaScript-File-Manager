/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

fm.Package("com.region");
fm.Import("jfm.html.Span");
fm.Import("com.post.Top");
fm.Import("jfm.html.Combobox");
fm.Class("Topbar", 'jfm.html.Container');
com.region.Topbar = function( ) {
	
	var openedMenu;
	this.Topbar = function( division ) {
		base({
		    height : 100,
		    css : {
			    'background-color' : '#FCF0FE'
		    }
		});
		
		var self = this;
		this.add(new Container({
		    html : "<a href='#'>Kerana</a>",
		    'class' : "logo"
		}));
		
		$(document).click(function( ) {
			openedMenu && openedMenu.hide();
		});
		
		var states = new Combobox([], {
		    hintText : "Select State",
		    inputTabIndex : 6
		});
		
		Cache.getInstance().getTemplate('States', function( data ) {
			states.updateData(jQuery.parseJSON(data));
		});
		
		Cache.getInstance().getTemplate('home', function( data ) {
			self.el.append(data);
			self.el.find(".category").click(division, onCategoryClick);
		});
		
		states.el.addClass("searchProduct");
		this.add(states);
	};
	
	function onCategoryClick( e ) {
		if (e.target.nodeName == "SPAN") {
			openedMenu && openedMenu.hide();
			openedMenu = $(e.target).next().show();
		}
		else if (e.target.nodeName == "A") {
			openedMenu.hide();
			if (fm.isExist("com.home.SubCategory")) {
				com.home.SubCategory.showSubCategory(e.target.href);
			}
			else {
				fm.Include("com.home.SubCategory", [ e.data, e.target.href ]);
			}
		}
		return false;
	}
	
};
