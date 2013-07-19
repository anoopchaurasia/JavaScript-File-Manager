/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 **/
var httpSerrver1;
fm.Package("");
fm.Import("constant.Constants");
fm.Import("cookie.Cookie");
fm.Import("facebook.FacebookAuth");
fm.Import("session.SessionManager");
fm.Import("user.User");
fm.Class("App");
App = function (me, Constants, Cookie, FacebookAuth, SessionManager, User){this.setMe=function(_me){me=_me;};
	console.log(Constants, Cookie, FacebookAuth, SessionManager, User);
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

		global.httpSerrver1 = http.createServer(function( req, resp ) {
			req.sessionM = sessionM;

			var t = new Date().getTime();
			var url_parts = url.parse(req.url, true);
			var servletName = url_parts.pathname;
			if (servletName.indexOf("?") != -1) {
				servletName = servletName.substring(0, servletName.indexOf("?"));
			}
			servletName = servletName.replace(/\//g, "");
			if (webPath.path[servletName] && !servletObj[servletName]) {
				loadServlet(webPath.path[servletName].class, servletName);
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
				if (!user && webPath.path[servletName].auth) {
					resp.writeHead(307, {
						'Content-Type' : 'text/plain'
					});
					resp.write("login");
					resp.end();
					return;
				}
				if (req.method == "POST") {
					var body = "";
					if(req.headers['content-type'].indexOf('multipart/form') != -1){
						servletObj[servletName].multiPart(req, resp, t);
						return;
					}

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
					console.log(servletName, servletObj[servletName].GET);
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
				if (servletName == "/") {
					req.url = "/index.html";
				}
				req.url = "/web" + req.url;
				if(servletName == "/jsfm.js"){
					req.url = "/src/node_modules/jsfm/jsfm.js";
				}
				staticServer.serve(req, resp, function( err, result ) {
					if (err) {
						console.error('Error serving %s - %s', req.url, err.message);
						resp.end();
					}
				});
			}

			// console.log(new Date().getTime() - t, servletName);
		});
		global.httpSerrver1.listen(Constants.port);
	};
};













