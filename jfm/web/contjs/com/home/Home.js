fm.isConcatinated = true; 
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

fm.Package("com.region");
fm.Import("jfm.html.Span");
fm.Import("jfm.html.Button");
fm.Import("com.post.Top");
fm.Import("jfm.html.Combobox");
fm.Class("Left", 'jfm.html.Container');
com.region.Left = function (base, me, Span, Button, Top, Combobox, Container) {
	this.setMe = function(_me) {
		me = _me;
	};
	//http://searchupc.com/developers/welcome.aspx
	this.Left = function(division) {
		base({
			width : 300,
			'class' : 'right',
			css : {
				'height' : '100%',
				'background-color' : '#FCF0FE'
			}
		});
		this.add("<div>Create List: </div>");
		var states = new Combobox([], {
			hintText : "Type Keywords (CTRL + SHIFT + c)",
			inputTabIndex : 3,
			hideButton : true,
			'class' : "type-combo",
			ignoreNumberOfCharacters : 1
		}, function(searchString, cb) {
			Server.getInstance("search").serviceCall({
				data : searchString
			}, "getRelevenceData", function(resp) {
				var arr = [], data;
				for ( var k = 0, len = resp.length; k < len; k++) {
					data = {
						k : resp[k].str,
						v : resp[k].id
					};
					arr.push(data);
				}
				cb(arr);
			});
			cb([ {
				k : "loading.......",
				v : ""
			} ]);
		});
		states.el.addClass("searchProduct");
		this.add(states);
		var count = 3;
		var btn = new Button({
			tabindex : 2,
			html : "Add",
			'class' : "add-category green-btn"
		});
		var self = this;
		btn.el.click(function() {
			self.add(count, new Container({
				html : '<span>' + states.getSelected().key
						+ '</span><img style="width:20px; float:right;margin-right: 16px; height:20px" src="/img/wrong_answer.gif" />'
			}));
			count++;
			console.log(states.getSelected());
			return false;
		});
		this.el.click(function(e) {
			if (e.target.nodeName == "IMG") {
				jQuery(e.target).parents("div:first").remove();
				count--;
			}
		});
		this.add(btn);
	};

};
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

fm.Package("com.home");

fm.Import("com.region.Left");
fm.Import("jfm.cache.Cache");
fm.Import("jfm.html.form.Text");
fm.Import("jfm.server.Server");
fm.Class("Home", "jfm.html.Container");
com.home.Home = function (base, me, Left, Cache, Text, Server, Container){this.setMe=function(_me){me=_me;};
	
	Static.main = function( args ) {
		this.onHashChange(args[0], args[1]);
	};
	
	Static.onHashChange = function( division, args1 ) {
		new me(division, args1);
	};
	
	this.Home = function( division, user ) {
		base({
			width : "100%",
			height : "100%"
		});
		var left = new Left();
		division.left.reset().add(left);
		division.center.reset().add(this);
	};
};


fm.isConcatinated = false;
