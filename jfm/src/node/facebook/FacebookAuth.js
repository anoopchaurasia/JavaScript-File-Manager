fm.Package("facebook");
FacebookSession = require("./FacebookSession");
fm.Class("FacebookAuth");
facebook.FacebookAuth = function( ) {
	function convertBase64ToHex( base64_string ) {
		var buffer = new Buffer(base64_string, 'base64');
		return buffer.toString('hex');
	}
	
	Static.Authenticate = function( req ) {
		var facebook_cookie_raw = req.header["cookie"].match(/fbsr_[\d]+\=([^; ]+)/);
		var facebook_cookie = null;
		var fbsr_cookie_parts = facebook_cookie_raw.split('.');
		var signature = self.convertBase64ToHex(fbsr_cookie_parts[0].replace(/\-/g, '+').replace(/\_/g, '/'));
		var payload = fbsr_cookie_parts[1];
		var facebook_cookie_raw_json = new Buffer(payload.replace(/\-/g, '+').replace(/\_/g, '/'), 'base64').toString('binary');
		facebook_cookie = JSON.parse(facebook_cookie_raw_json);
		var expected_signature = self.signaturePayload(payload);
		if (expected_signature !== signature) {
			return false;
		}
		return getSessionByOauthCode(facebook_cookie['code'])(cb);
	};
	function getSessionByOauthCode( oauth_code ) {
		var self = this;
		return function( cb ) {
			var session = new FacebookSession(self, null, oauth_code);
			cb(session);
		};
	};
	
	this.getAccessToken = function(params) {
        var access_params = {
                client_id: api_key,
                client_secret: api_secret
        };
        
        for (var key in params) {
            access_params[key] = params[key];
        }

        return function(cb) {
            doRawQueryRequest({
                'host': self.options.facebook_graph_secure_server_host,
                'port': self.options.facebook_graph_secure_server_port,
                'path': "/oauth/access_token" + '?' +  querystring.stringify(access_params),
                'secure': true,
                'timeout': self.options.timeout
            })(function(response) {
                if (!response) {
                    cb();
                } else {
                    cb(response.access_token, response.expires);
                }
            });
        };
    };
};
