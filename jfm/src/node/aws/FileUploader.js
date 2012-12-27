fm.Package("aws");
fm.Class('FileUploader', "Base");
aws.FileUploader = function (){
	var form, knox;
	
	this.method = function(req, res, t){
		var path = process.cwd() + "/web/aws/index.html";
		require('fs').readFile(path, function( err, data ) {
			if (err) {
				console.log(err);
			}
			else {
				res.write(data);
				res.end();
			}
		});
	};
	
	this.multiPart = function(req, resp){
	
	form.parse(req, function(err, fields, files) {
			resp.write('received upload:\n\n');
			client.putFile(files['files[]'].path, "anoop/"
					+ files['files[]'].name, function(err, res) {
				console.log(err, "aws");
			});
			resp.end();
		});
	};
	
	this.FileUploader = function(){
		var formidable = require("formidable"); 
		form = new formidable.IncomingForm();
		var knox = require("knox");
		client = knox.createClient({
		    key: 'AKIAIPVY55PJLVYQVUBQ'
		  , secret: 'keDjC4needTEggZVhifSb/H1wj8a6ibABaviLKBH'
		  , bucket: 'dev-practo-software-files'
		});
		
		client.putFile("C:/Users/Public/Pictures/Sample Pictures/Desert.jpg", "anoop/Desert1.jpg", function(err, res){
	    	  console.log(err, "aws");
	    	 // resp.end();
	    });
	};
};