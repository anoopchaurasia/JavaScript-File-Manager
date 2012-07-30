/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var fs = require('fs');
fm.Package("test");
fm.Import("cookie.Cookie");
fm.Class("Template", "Base");
test.Template = function( base, me, Cookie,  Base){this.setMe=function(_me){me=_me;};

	this.getTemplate = function( req, resp, t ) {
//		if (!req.session && req.params.data != 'login') {
//			resp.writeHead(307, {
//				'Content-Type' : 'text/plain'
//			});
//			resp.write("login");
//			resp.end();
//			return;
//		}
		var path = process.cwd() + "/web/templates/" + req.params.data + ".html";
		console.log(path, "ddd"   );
		fs.readFile(path, function( err, data ) {
			if (err) {
				console.log(err);
			} 
			else {
				resp.write(data);
				resp.end("\n");
			}
			console.log(new Date().getTime() - t);
		});
		
	};
	this.method = function( ) {/**/};
};
console.log("Anoop ");






