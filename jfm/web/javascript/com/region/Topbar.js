/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

fm.Package("com.region");
fm.Import("jfm.html.Span");
fm.Import("com.post.Top");
fm.Import("jfm.html.Combobox");
fm.Class("Topbar", 'jfm.html.Container');
com.region.Topbar = function (base, me, Span, Top, Combobox, Container) {
	this.setMe = function( _me ) {
		me = _me;
	};
	
	var openedMenu;
	
	function loadFacebook( ) {
		
		var c = document.createElement("script");
		c.src = '//connect.facebook.net/en_US/all.js';
		document.getElementsByTagName('head')[0].appendChild(c);
	}
	
	this.Topbar = function( division ) {
		
		base({
		    height : 100,
		    css : {
			    'background-color' : '#FCF0FE'
		    }
		});
		
		loadFacebook();
		
		var self = this;
		this.add(new Container({
		    html : "<a href='#'>Kerana</a>",
		    'class' : "logo"
		}));
		
		this.add(new Button({
		    html : "Register",
		    'class' : 'register green-btn',
		    click:function(){
		    	if(fm.isExist('shop.Register') ){
		    		new shop.Register(division);
		    	}
		    	else{
		    		fm.Include("shop.Register", division);
		    	}
		    }
		}));
		
		$(document).click(function( ) {
			openedMenu && openedMenu.hide();
		});
		
		Cache.getInstance().getTemplate('home', function( data ) {
			self.el.append(data);
			self.el.find(".category").click(division, onCategoryClick);
		});
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
