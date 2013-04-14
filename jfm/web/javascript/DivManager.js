/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
fm.Package("");
fm.Class("DivManager", 'jfm.html.DomManager');

DivManager = function ( base, me, DomManager ){this.setMe=function(_me){me=_me;};  

	this.DivManager = function  () {
		base();
	};

	this.anoop = function () {
		console.log(arguments);
	};

	this.testing = {};
	this.change = function () {
		//console.log(arguments);
	};
	
	this.testing.text = "Anoop";
	this.testing.checkbox = true;
	this.testing.radio = 2;
	this.testing.select = "C";
};



