/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
fm.Package("user");
fm.Class("User");
user.User = function (me) {
	this.setMe = function( _me ) {
		me = _me;
	};
	
	this.toArray = function( ) {
		var userarr = [ this.firstName, this.lastName, this.email, this.password, 1 ];
		return userarr;
	};
	this.User = function( obj ) {
		this.firstName = obj.firstName || obj.firstname;
		this.lastName = obj.lastName || obj.lastname;
		this.email = obj.email;
		this.password = obj.password;
	};
	
	Static.getUser = function( client, cb ) {
		console.log(usr);
		client.query("select * from user1 where email='" + this.email + "'", function( err, b ) {
			if (err) {
				cb && cb(err);
			}
			else if (b.rows.length) {
				cb && cb(new user.User(b.rows[0]));
			}
			else {
				cb && cb(null);
			}
		});
	};
	
	this.createUser = function( client, cb ) {
		client.query("insert into user1 (firstname, lastname, email, password, verified) values($1, $2, $3, $4, $5)", this.toArray(), function( e, b ) {
			cb && cb.apply(this, arguments);
		});
	};
};
