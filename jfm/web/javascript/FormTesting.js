/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
fm.Package("");
fm.Import("jfm.html.FormManager");
fm.Class("FormTesting");

FormTesting = function (me, FormManager ){this.setMe=function(_me){me=_me;};  

	Static.main = function() {
		ttttt = {
			testing:{
				text:"Anoop",
				checkbox: true,
				radio: 2,
				select: 'B'
			}
		};

		FormManager.setData($("form[name='testing']")[0], ttttt);
	};
};

