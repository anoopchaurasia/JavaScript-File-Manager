fm.Package("test");
var fs = require('fs');
fm.Class("SubCategory", "Base");
test.SubCategory = function( base, me,  Base){this.setMe=function(_me){me=_me;};

	
	this.method = function(req, res){
		res.write("Anoop Kumar Chaurasia");
		res.end();
	};
	this.getSubCategory = function(req, resp){
		
		var path = process.cwd() + "/web/templates/"+req.params.id+ ".html";
        fs.readFile(path, function (err, data) {
            if (err) {
                console.log(err);
            }
            else{           
                resp.write(data);
                resp.end("\n");
            }
             console.log(new Date().getTime() - t);
        });
	};
	
	this.SubCategory = function() {
		
    };
};






