/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
fm.Package("");
fm.Import("jfm.html.LoopScope");
fm.Class("DivManager", 'jfm.html.DomManager');

DivManager = function ( base, me, DomManager ){this.setMe=function(_me){me=_me;};  

	this.DivManager = function  () {
		base();

		setTimeout(function  () {
			
			 me.dataUpdated();
		}, 10000);
	};
	this.arrrr=[];
	this.options = [0,1,2,3,4,5,56,7,8787,787,9,89,0,0,0,00];
	for(var i=0; i < 2; i++){
		this.arrrr.push(i);

	}

	this.hello = function () {
		console.log(arguments)
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
	this.testing.select = 1;
};



