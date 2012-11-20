fm.Package("searchfolder");
fm.Class("SearchFolder", "Base");
searchfolder.SearchFolder = function(){
	var list = null, len = 0, fs, baseDir;
	this.getFileList = function(req, resp){
		
		
		var name = req.params.name, arr = [];
		try{
			var reg = new RegExp(name, "i");
			for ( var i = 0; i < len; i++) {
				if(list[i].match(reg)){
					arr.push(list[i]);
				}
			}
		    resp.write(JSON.stringify(arr));
		    resp.end("\n");
		}catch(e){
			resp.end("\n");
		}
	};
	
	this.download = function(req, res){
		var filename = decodeURI(req.urlparts.pathname.substring("download".length + 1));
		console.log("download",baseDir + filename);
		fs.readFile(baseDir + filename,  function (err,data) {
			  if (err) {
				  res.end("\n");
				return
			}
			res.end(data);
		});
	};
	
	this.method = function(req, res){
		var path = process.cwd() + "/web/html/download.html";
		
		require('fs').readFile(path, function( err, data ) {
			if (err) {
				console.log(err);
			}
			else {
				res.write(data);
				res.end("\n");
			}
		});
	};
	
	this.SearchFolder = function(){
		list = [];
		fs = require('fs');
		baseDir = "C:/Users/Anoop/Downloads";
		walker = require('walk').walk(baseDir, { followLinks: false });
		walker.on('file', function(root, stat, next){
			list.push(root.replace(baseDir,"") + "/" + stat.name);
			next();
		});
		walker.on('end', function() {
		    len = list.length;
		});
	};
};