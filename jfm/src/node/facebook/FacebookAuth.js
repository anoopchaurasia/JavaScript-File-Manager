fm.Package("facebook");
FacebookSession = require("./FacebookSession");
fm.Class("FacebookAuth");
facebook.FacebookAuth = function() {
	function convertBase64ToHex(base64_string) {
		var buffer = new Buffer(base64_string, 'base64');
		return buffer.toString('hex');
	}
	var crypto = require('crypto');
	Static.Authenticate = function(req, cb) {
		var facebook_cookie_raw = req.headers["cookie"].match(/fbsr_[\d]+\=([^; ]+)/);
		if (facebook_cookie_raw.length == 0) {
			return;
		}
		var facebook_cookie = null;
		var fbsr_cookie_parts = facebook_cookie_raw[1].split('.');
		var signature = convertBase64ToHex(fbsr_cookie_parts[0].replace(/\-/g, '+').replace(/\_/g, '/'));
		var payload = fbsr_cookie_parts[1];
		var facebook_cookie_raw_json = new Buffer(payload.replace(/\-/g, '+').replace(/\_/g, '/'), 'base64').toString('binary');
		facebook_cookie = JSON.parse(facebook_cookie_raw_json);
		var expected_signature = signaturePayload(payload);
		if (expected_signature !== signature) {
			return false;
		}
		return getSessionByOauthCode(facebook_cookie['code'], cb);
	};
	function getSessionByOauthCode(oauth_code, cb) {
		var self = this;
		var session = new FacebookSession.FacebookSession(self, null, oauth_code);
		cb(session);
	}
	;

	function signaturePayload(payload) {
		return crypto.createHmac('SHA256', 'f998908540ca43f5d96e99060e465d8b').update(payload).digest('hex');
	}

	this.getAccessToken = function(params) {
		var access_params = {
			client_id : api_key,
			client_secret : api_secret
		};

		for ( var key in params) {
			access_params[key] = params[key];
		}

		return function(cb) {
			doRawQueryRequest({
				'host' : self.options.facebook_graph_secure_server_host,
				'port' : self.options.facebook_graph_secure_server_port,
				'path' : "/oauth/access_token" + '?' + querystring.stringify(access_params),
				'secure' : true,
				'timeout' : self.options.timeout
			})(function(response) {
				if (!response) {
					cb();
				}
				else {
					cb(response.access_token, response.expires);
				}
			});
		};
	};
};
