/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
fm.Package("user");
fm.Class("User");
user.User = function( me){this.setMe=function(_me){me=_me;};

	this.toArray = function( ) {
		var userarr = [ this.firstName, this.lastName, this.companyName, this.suite, this.address, this.phone, this.comptype, this.org, this.fromwhere, 1 ];
		return userarr;
	};
	this.User = function( obj ) {
		this.firstName = obj.firstName || obj.firstname;
		this.lastName = obj.lastName || obj.lastname;
		this.companyName = obj.companyName || obj.companyname;
		this.suite = obj.suite;
		this.address = obj.address;
		this.phone = obj.phone;
		this.email = obj.email;
		this.comptype = obj.comptype;
		this.org = obj.org;
		this.fromwhere = obj.fromwhere;
	};
	
	Static.getUser = function( client, usr, cb ) {
		console.log(usr);
		client.query("select * from user1 where email='" + usr.email + "'", function(err, b ) {
			if(err){
				cb  && cb(err);
			}else if (b.rows.length){
				cb && cb(new user.User(b.rows[0]));
			}
			else{
				cb  && cb(null);
			}
		});
	};
};









