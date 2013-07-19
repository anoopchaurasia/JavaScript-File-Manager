fm.Package("test");
fm.Class("Reader", "Base");
test.Reader = function (base, me, Base){this.setMe=function(_me){me=_me;};
	
	this.method = function( req, res ) {
		var path = process.cwd() + "/jfm/../web/html/reader.html";
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
};