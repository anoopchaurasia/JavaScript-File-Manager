fm.Package("com.post");
fm.Import("jfm.cache.Cache");
fm.Class("Left", "jfm.html.Container");
com.post.Left = function (base, me, Cache, Container){this.setMe=function(_me){me=_me;};

	
	this.Left = function(cb){
		var self = this;
		base({height:"100%", width:200, css:{'background-color':"#ccc", "overflow-y":"auto"}});
		Cache.getInstance().getTemplate('classifiedList', function(resp){
			var a = JSON.parse(resp), html = "";
			for(var k = 0; k < a.length; k++){
				html += "<a href='"+ a[k] +"'>" + a[k] + "</a></br>";
			}
			self.el.html(html);			
		});
		self.el.click(function(e){
			if(e.target.nodeName == 'A'){
				e.preventDefault();
				cb(e.target.href);
				return false;
			}
		});
	};
};

