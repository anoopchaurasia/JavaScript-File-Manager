/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

fm.Package("test");
fm.Import("constant.Constants");
fm.Import("user.User");
fm.Class("Home", "Base");
test.Home = function (base, me, Constants, User, Base){this.setMe=function(_me){me=_me;};

	var client, email ;
	function sendMail( mail, res ) {
		debugger;
		email.send({
		    host : "mail.imaginea.com", // smtp server hostname
		    port : "25", // smtp server port
		    domain : "mail.imaginea.com", // domain used by client to identify
		    // itself to server
		    from : "anoop.c@imaginea.com",
		    to : mail,
		    subject : "Mail varification...",
		    body : "<a href='http://" + Constants.getIP() + ":" + Constants.port + "/?e=" + mail + "&method=verify' >Click</a>",
		    authentication : "login",
		    username : Constants.userName,
		    password : Constants.password
		}, function( err, result ) {
			if (err) {
				res.write(JSON.stringify(err));
				res.end();
			}
			else {
				res.writeHead(200, {
					'Content-Type' : 'text/plain'
				});
				console.log(result);
				res.write(JSON.stringify(err));
				res.end();
			}
		});
	}
	this.method = function( req, res ) { /* /Abstract method ; */
	
	};
	
	this.join = function( req, res ) {
		
		openid.authenticate(
		                    parsedUrl.query.openid_identifier, // user supplied identifier
		                    'http://localhost:8888/#verify', // our callback URL
		                    null, // realm (optional)
		                    false, // attempt immediate authentication first?
		                    function(authUrl)
		                    {
		                        res.writeHead(302, { Location: authUrl });
		                        res.end();
		                    });
		
		
		var user = JSON.parse(req.params.user);
		var userarr = [ user.email, 0 ];
		client.query("INSERT INTO user1(email, verified) values($1, $2)", userarr);
		try {
			sendMail(user.email, res);
		}
		catch (e) {
			res.write("This mail already exist!");
			res.end();
		}
	};
	this.signin = function( req, res ) {
		
		user.User.getUser(client, JSON.parse(req.params.user), function( usr ) {
			if (usr) {
				var session = req.sessionM, sess = {};
				sess.sessionId = usr.email;
				sess.userId = usr.firstName;
				res.setHeader('Set-Cookie', "SESSIONID=" + sess.sessionId + "");
				res.write("home");
				session.add(sess.sessionId, sess);
			}
			else{
				res.write("login");
			}
			res.end();
			
		});
		
	};
	
	this.getUser = function( req, res ) {
		user.User.getUser(client, JSON.parse(req.params.user), function( usr ) {
			res.writeHead(200, {
				'Content-Type' : 'text/json'
			});
			res.write(JSON.stringify(usr));
			res.end();
		});
	};
	
	this.Home = function( ) {
		var pg = require('pg');
		email = require('mailer');
		var conString = "tcp://postgres:adminadmin@localhost/postgres";
		client = new pg.Client(conString);
		// client.query("drop table user1");
		// client
		// .query("CREATE TABLE user1(firstname varchar(20), "
		// + "lastname varchar(20), companyname varchar(20), suite
		// varchar(20),address varchar(200), phone varchar(12),"
		// + "email varchar(50), verified bit, comptype integer, org
		// varchar(100), fromwhere varchar(100))");
		client.connect();
	};
};









