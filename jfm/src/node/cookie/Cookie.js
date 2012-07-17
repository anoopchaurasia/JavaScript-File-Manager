fm.Package("cookie");
fm.Class("Cookie");
cookie.Cookie = function(){	
	
	Static.getCookie = function(req){
		var c = req.headers.cookie && req.headers.cookie.split(";");
		var cookie= {},
			temp ;
		if(c){
			for(var k = 0;  k < c.length; k++){
				temp = c[k].split("=");
				cookie[temp[0]] = temp[1]; 
			}
		}
		return cookie;
	};
};