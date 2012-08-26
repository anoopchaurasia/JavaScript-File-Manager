var fs = require('fs');
var IncludedInside = [], circulerReference = {};

function mkdir( path, root ) {
	if (!path) {
		return;
	}
	var dirs = path.split('/'), dir = dirs.shift(), root = (root || '') + dir + '/';
	try {
		fs.mkdirSync(root);
	}
	catch (e) {
		// dir wasn't made, something went wrong
		if (!fs.statSync(root).isDirectory())
			throw new Error(e);
	}
	return !dirs.length || mkdir(dirs.join('/'), root);
}

function Concatenation( sourceDir, destinDir ) {
	var isConcatinatedAdded = false, concatenatedString = "", ConcatenatedFiles = {};
	function executeFile( data ) {
		var result, classIndex = 0;
		var d = data.replace(/\s/g, ""), reg;
		
		if (d.indexOf("prototype.$add=function(obj,key,val,isConst)") != -1) {
			concatenatedString += data;
			return;
		}
		result = /fm.class\((.*?)\)/gi.exec(d) || /fm.Interface\((.*?)\)/gi.exec(d) || /fm.AbstractClass\((.*?)\)/gi.exec(d);
		if (result) {
			classIndex = result.index;
			result = result[1];
			result = result.substring(1, result.length - 1).split(",")[1];
			if (result) {
				result = result.substring(1).trim().replace(/\./g, "/") + ".js";
				processFile(sourceDir + result);
			}
		}
		
		reg = /fm.include\((.*?)\)/gi;
		var index;
		while (result = reg.exec(d)) {
			index = result.index;
			result = result[1];
			result = result.substring(1, result.length - 1).replace(/\./g, "/") + ".js";
			if (index > classIndex) {
				IncludedInside.push(result.split(",")[0].replace(/"/gm, ''));
				continue;
			}
			processFile(sourceDir + result);
		}
		
		reg = /fm.import\((.*?)\)/gi;
		while (result = reg.exec(d)) {
			result = result[1];
			result = result.substring(1, result.length - 1).replace(/\./g, "/") + ".js";
			processFile(sourceDir + result);
		}
		
		reg = /fm.Implements\((.*?)\)/gi;
		if (result = reg.exec(d)) {
			result = result[1].split(",");
			
			for ( var k = 0; k < result.length; k++) {
				processFile(sourceDir + result[k].substring(1, result[k].length - 1).replace(/\./g, "/") + ".js");
			}
		}
		if (!isConcatinatedAdded) {
			isConcatinatedAdded = true;
			concatenatedString += "fm.isConcatinated = true; \n";
		}
		concatenatedString += data;
	}
	
	function processFile( path ) {
		if (!ConcatenatedFiles[path]) {
			ConcatenatedFiles[path] = true;
			try {
				executeFile(fs.readFileSync(path).toString('utf-8'));
			}
			catch (e) {
				console.log(e);
			}
		}
		
	}
	
	function deleteFile( dir ) {
		fs.unlink(dir, function( ) {
		// dfdfdf
		});
	}
	function clone(obj){
		var newobj = {};
		for(var k in obj){
			newobj[k]= obj[k];
		}
		return newobj;
	}
	this.concatenateJSFiles = function( sFiles, concate ) {
		ext = "js";
		backSlash = "";
		var len = sFiles.length;
		var dFile = sFiles[len - 1];
		mkdir(dFile.substring(0, dFile.lastIndexOf("/")), destinDir);
		deleteFile(destinDir + dFile);
		
		concatenatedString += "";
		ConcatenatedFiles = concate;
		for ( var i = 0; i < sFiles.length; i++) {
			processFile(sourceDir + sFiles[i]);
		}
		concatenatedString += "fm.isConcatinated = false;\n";
		fs.writeFileSync(destinDir + dFile, concatenatedString, 'utf8', function( e ) {
			console.log(e);
		});
		var s, fname;
		console.log(destinDir + dFile, IncludedInside);
		while (IncludedInside.length) {
			fname = IncludedInside.pop();
			if (fname.indexOf('http') != -1) {
				continue;
			}
			s = fname + ".js";
			new Concatenation(sourceDir, destinDir).concatenateJSFiles([ s ], clone(ConcatenatedFiles) );
		}
	};
}

function runall( ) {
	console.log("Test:start");
	var ajt = new createJFM(), lastRun = Number(fs.readFileSync("lastRun").toString('utf-8'));
	walk("D:/workspace/jfm/src/node", ajt.create, lastRun);
	walk("D:/workspace/jfm/web/javascript", ajt.create, lastRun);
	fs.writeFile("lastRun", "" + Date.now(), function( ) {});
	console.log("Test");
	
	console.log("RunAll");
	var sourceDir = "D:/workspace/jfm/web/javascript/", destinDir = "D:/workspace/jfm/web/contjs/";
	var inputFiles = [];
	inputFiles.push("App.js");
	var ajt = new Concatenation(sourceDir, destinDir);
	ajt.concatenateJSFiles(inputFiles, {});
	
	var ajt = new Concatenation(sourceDir, destinDir);
	ajt.concatenateJSFiles(["com/reader/Reader.js"], {});

}
runall();

function createJFM( ) {
	function executeFile( data ) {
		var imports = [ 'me' ], add = true, result;
		var d = data.replace(/\s/g, ""), reg = /fm.class|fm.AbstractClass/mi;
		if (d.indexOf("prototype.$add=function(obj,key,val,isConst)") != -1) {
			return;
		}
		if (!d.match(reg)) {
			return;
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
		return data.replace(reg, "= function (" + imports.join(", ") + ")");
	}
	
	this.create = function( sFiles ) {
		console.log("test:" + sFiles);
		var data = executeFile(fs.readFileSync(sFiles).toString('utf-8'));
		data && fs.writeFileSync(sFiles, data, 'utf-8');
	};
}

function walk( dir, cb, lastRun ) {
	var stat, file, list = fs.readdirSync(dir);
	if (list) {
		for ( var l = 0; l < list.length; l++) {
			file = list[l];
			if (!file)
				continue;
			file = dir + '/' + file;
			stat = fs.statSync(file);
			if (stat && stat.isDirectory()) {
				walk(file, cb, lastRun);
			}
			else {
				(new Date(stat.mtime).getTime()) > lastRun && cb(file);
			}
		}
	}
}
