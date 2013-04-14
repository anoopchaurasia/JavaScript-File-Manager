/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
fm.Package("");
fm.Import("DivManager");
fm.Class("FormTesting");

FormTesting = function (me, DivManager ){this.setMe=function(_me){me=_me;};  

	Static.main = function() {
		new DivManager();
	};
};



