var fs = require('fs');
var circulerReferenc = {};
function Concatenation( ) {
	function executeFile( data ) {
		var imports = [ 'me' ], add = true, result;
		var d = data.replace(/\s/g, ""), reg = /fm.class|fm.AbstractClass/mi;
		if(d.indexOf("prototype.$add=function(obj,key,val,isConst)") !=-1){
			return "";
		}
		if (!d.match(reg)) {
			return "";
		}
		if (d.indexOf("this.setMe=function(_me){me=_me;}") != -1) {
			add = false;
		}
		reg = /fm.import\((.*?)\)/gi;
		while (result = reg.exec(d)) {
			result = result[1];
			result = result.substring(1, result.length - 1).split(".");
			imports.push(result[result.length - 1]);
		}
		reg = /fm.class\((.*?)\)/gi;
		if (result = reg.exec(d)) {
			result = result[1];
			result = result.substring(1, result.length - 1).split(",")[1];
			if (result) {
				imports.unshift('base');
				result = result.substring(1).split(".");
				imports.push(result[result.length - 1]);
			}
		}
		if (add) {
			reg = /=\s*function\s*\((.*?){/mi;
			return data.replace(reg, "= function (" + imports.join(", ") + "){this.setMe=function(_me){me=_me;};");
		}
		reg = /=\s*function\s*\((.*?)\)/mi;
		console.log("reached");
		return data.replace(reg, "= function (" + imports.join(", ") + ")");
	}
	
	this.concatenateJSFiles = function( sFiles ) {
		console.log("test:" + sFiles);
		var data = executeFile(fs.readFileSync(sFiles).toString('utf-8'));
		data && fs.writeFile(sFiles, data);
	};
}

function runall( ) {
	console.log("Test:start");
	var ajt = new Concatenation(),
	lastRun = Number(fs.readFileSync("lastRun").toString('utf-8'));
	walk("D:/workspace/jfm/src/node", ajt.concatenateJSFiles, lastRun);
	walk("D:/workspace/jfm/web/javascript", ajt.concatenateJSFiles, lastRun);
	fs.writeFile("lastRun", "" + Date.now(), function( ) {});
	console.log("Test");
}

var fs = require('fs');
var walk = function( dir, cb, lastRun ) {
	var stat, file,
	list = fs.readdirSync(dir);
	if (list) {
		for ( var l = 0; l < list.length; l++) {
			file = list[l];
			if(!file) continue;
			file = dir +  '/' + file;
			stat = fs.statSync( file );
			if (stat && stat.isDirectory()) {
				walk(file, cb, lastRun);
			}
			else {
				(new Date(stat.mtime). getTime()) > lastRun && cb(file);
			}
		}
	}
};
runall();
