/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

fm.Package("com.region");
fm.Import("jfm.html.Span");
fm.Import("com.post.Top");
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
		this.add(new Span({
			html : "Event Managment"
		}));
		this.add(new Top(division.center));
	};
};