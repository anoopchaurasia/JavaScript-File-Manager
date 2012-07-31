fm.Package("cookie");
fm.Class("Cookie");
cookie.Cookie = function (me){this.setMe=function(_me){me=_me;};
	
	
	Static.getCookie = function(req){
		var c = req.headers.cookie && req.headers.cookie.split(";");
		var cookie= {},
			temp ;
		if(c){
			for(var k = 0;  k < c.length; k++){
				temp = c[k].split("=");
				cookie[temp[0].trim()] = temp[1]; 
			}
		}
		return cookie;
	};
};








