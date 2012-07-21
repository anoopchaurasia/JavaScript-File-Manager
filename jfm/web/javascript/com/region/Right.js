/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

fm.Package("com.region");
fm.Import("jfm.html.Span");
fm.Import("com.post.Top");
fm.Import("jfm.html.Combobox");
fm.Class("Right", 'jfm.html.Container');
com.region.Right = function( ) {
	
	this.Right = function( division ) {
		base({
		    width : 300,
		    'class' : 'right',
		    css : {
		        'height' : '100%',
		        'background-color' : '#FCF0FE'
		    }
		});
		
		var states = new Combobox([], {
		    hintText : "Select State",
		    inputTabIndex : 6,
		    ignoreNumberOfCharacters : 1
		}, function( searchString, cb ) {
			Server.getInstance("search").serviceCall({
				data : searchString
			}, "getRelevenceData", function( resp ) {
				resp = JSON.parse(resp);
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
	};
	
};
