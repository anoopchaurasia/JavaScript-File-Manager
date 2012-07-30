/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
fm.Package("post");
fm.Class("Post");
post.Post = function( me){this.setMe=function(_me){me=_me;};

	this.toArray = function( ) {
		var arr = [];
		for(var k in this){
			this.hasOwnProperty(k) && arr.push(this[k]);
		}
		return arr;
	};
	this.Post = function( obj ) {
		this.email = obj.email;
		this.city = obj.city;
        this.locality = obj.locality;
        this.category = obj.category;
        this.subCategory = obj.subCategory || obj.subcategory;
        this.title= obj.title;
        this.description = obj.description;
        this.mono = obj.mon;	
	};
	
	Static.getPost = function( client, usr, cb ) {
		console.log(usr);
		client.query("select * from post where email='" + usr.email + "'", function(err, b ) {
			if(err){
				cb  && cb(err);
			}else{
				cb  && cb(new post.Post(b.rows[0]));
			}
		});
	};
	
};







