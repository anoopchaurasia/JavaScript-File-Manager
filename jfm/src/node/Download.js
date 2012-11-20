/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
fm.Package("");
fm.Import("constant.Constants");
fm.Import("cookie.Cookie");
fm.Import("facebook.FacebookAuth");
fm.Import("session.SessionManager");
fm.Import("user.User");
fm.Class("Download");
Download = function (me, Constants, Cookie, FacebookAuth, SessionManager, User){this.setMe=function(_me){me=_me;};
	var http, url, qs, servletObj, staticServer, sessionM;
	console.log(process.execArgv);
	this.init = function( ) {
		fm.Include('web');
		http = require('http');
		sessionM = session.SessionManager.getInstance();
		url = require('url'), qs = require('querystring');
		servletObj = {};
		staticServer = new (require('node-static').Server)(undefined, {
		    cache : 1,
		    headers : {
			    'X-Powered-By' : 'node-static'
		    }
		});
		process.on('uncaughtException', function( err ) {
			console.error(err.stack);
		});
	};
	
	function loadServlet( path, key ) {
		fm.Include(path);
		servletObj[key] = new (fm.stringToObject(path))();
	}
	
	Static.main = function( args ) {
		
		http.createServer(function( req, resp ) {
			req.sessionM = sessionM;
			
			var t = new Date().getTime();
			var url_parts = url.parse(req.url, true);
			var servletName = url_parts.pathname;
			if (servletName.indexOf("?") != -1) {
				servletName = servletName.substring(0, servletName.indexOf("?"));
			}
			servletName = servletName.replace(/\//g, "");
			if (webPath[servletName] && !servletObj[servletName]) {
				loadServlet(webPath[servletName].class, servletName);
			}
			if (servletObj[servletName]) {
				var c = cookie.Cookie.getCookie(req);
				var SessionId = c["SESSIONID"];
				var user = sessionM.getSession(SessionId);
				req.cookie = c;
				req.session = user;
				// facebook.FacebookAuth .Authenticate(req,function(session){
				// console.log(session);
				// });
				if (!user && webPath[servletName].auth) {
					resp.writeHead(307, {
						'Content-Type' : 'text/plain'
					});
					resp.write("login");
					resp.end();
					return;
				}
				if (req.method == "POST") {
					var body = "";
					facebook.FacebookAuth.Authenticate(req, function( ) {
						console.log(arguments[0]);
					});
					req.on('data', function( data ) {
						body += data;
					});
					req.on('end', function( ) {
						req.params = qs.parse(body);
						try {
							servletObj[servletName].POST(req, resp, t);
						}
						catch (e) {
							console.log(e);
							// resp.write(JSON.parse(e));
							resp.end();
						}
					});
				}
				else if (req.method == "GET") {
					var query = url_parts.query;
					req.params = query;
					try {
						servletObj[servletName].GET(req, resp, t);
					}
					catch (e) {
						// resp.write(JSON.parse(e));
						resp.end();
					}
				}
			}
			else {
				servletName = "download";
				if (webPath[servletName] && !servletObj[servletName]) {
					loadServlet(webPath[servletName].class, servletName);
				}
				servletObj[servletName].download(req, resp, t);
			}
		}).listen(81);
	};
};













