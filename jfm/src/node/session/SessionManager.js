fm.Package("session");
fm.Import("constant.Constants");
fm.Class("SessionManager");
session.SessionManager = function( me, Constants){this.setMe=function(_me){me=_me;};

	var sessions, singleton;
	this.Static.getInstance = function( ) {
		if (!singleton) {
			singleton = new me();
		}
		return singleton;
	};
	
	this.SessionManager = function( ) {
		sessions= {};
		setInterval(function( ) {
			var currentTime = Date.now();
			var sessionTimeOut = constant.Constants.sessionTimeOut;
			for ( var k in sessions) {
				console.log(currentTime- sessions[k].lastAccess, sessionTimeOut);
				if (currentTime - sessions[k].lastAccess > sessionTimeOut) {
					console.log("Deleting sessionid " + k);
					delete sessions[k];
				}
			}
		}, Constants.interVal);
	};
	
	this.add = function( sessionId, sessionData ) {
		
		sessions[sessionId] = sessionData;
		this.updateTime(sessionId);
	};
	
	this.remove = function( sessionId ) {
		if (sessions[sessionId]) {
			return delete sessions[sessionId];
		}
		return false;
	};
	
	this.updateTime = function( sessionId ) {
		sessions[sessionId].lastAccess = Date.now();
	};
	
	this.getSession = function( sessionId ) {
		var s = sessions[sessionId]; 
		s && this.updateTime(sessionId);
		return s;
	};
};







