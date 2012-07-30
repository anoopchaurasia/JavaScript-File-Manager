fm.Package("test");
fm.Class("Search", "Base");
test.Search = function( base, me,  Base){this.setMe=function(_me){me=_me;};

	var client;
	
	this.getRelevenceData = function(req, res){
		var str = req.params.data;
		client.query("Select * from search where lower(str) like lower('"+ str +"%')  LIMIT 10", function(err, b){
			if(err){
				console.log(err);
			}
			b && res.write(JSON.stringify(b.rows));
			res.end();
		});
	};
	
	this.method = function(req, res){
		res.end();
	};
	
	this.Search = function( ) {
		var pg = require('pg');
		var conString = "tcp://postgres:adminadmin@localhost/postgres";
		client = new pg.Client(conString);
	//	client.query("CREATE TABLE search (id serial, str varchar(100))");
//		try{
//		for(var k =0; k < data.length; k++){
//			client.query("INSERT INTO search (str) values('"+ data[k]+"')");
//		}
//		}catch(e){
//			console.log(e);
//		}
		client.connect();
	};
};









