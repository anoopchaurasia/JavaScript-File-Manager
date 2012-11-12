var fs = require('fs');
var jsp = require("uglify-js").parser;
var pro = require("uglify-js").uglify;
//var uglifyjs =  require("uglify-js");
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
	function executeFile( data, updateFile ) {
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
				processFile(sourceDir + result, updateFile);
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
			processFile(sourceDir + result, updateFile);
		}
		
		reg = /fm.import\((.*?)\)/gi;
		while (result = reg.exec(d)) {
			result = result[1];
			result = result.substring(1, result.length - 1).replace(/\./g, "/") + ".js";
			processFile(sourceDir + result, updateFile);
		}
		
		
		reg = /fm.Implements\((.*?)\)/gi;
		if (result = reg.exec(d)) {
			result = result[1].split(",");
			
			for ( var k = 0; k < result.length; k++) {
			
				processFile(sourceDir + result[k].substring(1, result[k].length - 1).replace(/\./g, "/") + ".js", updateFile);
			}
		}
		
		reg = /\/\/TMPL:START(.*?):END/gi;
		data = data.replace(reg, function(){
			var key = arguments[1].trim().split("|");
			var html = fs.readFileSync(sourceDir + key.join("/")).toString('utf-8').replace(/\n/g, "");
			return "Cache.getI().addTmpl('" + html + "', '"+ key[1] +"');";
		});
		
		if (!isConcatinatedAdded) {
			isConcatinatedAdded = true;
			concatenatedString += "fm.isConcatinated = true; \n";
		}
		concatenatedString += data;
	}
	
	function processFile( path, updateFile ) {
		if (!ConcatenatedFiles[path]) {
			ConcatenatedFiles[path] = true;
			try {
				var fileData = fs.readFileSync(path).toString('utf-8');
				updateFile(path, fileData);
				executeFile(fileData, updateFile);
			}
			catch (e) {
				console.error(e);
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
	this.concatenateJSFiles = function( sFiles, concate, updatefile ) {
		ext = "js";
		backSlash = "";
		var len = sFiles.length;
		var dFile = sFiles[len - 1];
		mkdir(dFile.substring(0, dFile.lastIndexOf("/")), destinDir);
		deleteFile(destinDir + dFile);
		
		concatenatedString += "";
		ConcatenatedFiles = concate;
		for ( var i = 0; i < sFiles.length; i++) {
			processFile(sourceDir + sFiles[i], updatefile);
		}
		concatenatedString += ";\nfm.isConcatinated = false;\n";
		fs.writeFileSync(destinDir + dFile, concatenatedString, 'utf8', function( e ) {
			console.log("response", e, arguments);
		});
		var ast = jsp.parse(concatenatedString); // parse code and get the initial AST
		ast = pro.ast_mangle(ast); // get a new AST with mangled names
		ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
		var final_code = pro.gen_code(ast); // compressed code here
		fs.writeFileSync(destinDir + dFile + "min.js", final_code, 'utf8',
			function(e) {
				console.log(e);
			}
		);
		var s, fname;
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

function runall( a ) {
	var sourceDir = a[2],
	destinDir = a[3],
	files = [];
	
	if(a.length < 5){
		throw "Please provide sourceDir destinDir files";
	}
	
	if(sourceDir == destinDir){
		throw "Source directory and destination directory can not be same.";
	}
	
	for(var k=4; k < a.length; k++ ){
		files.push(a[k]);
	}
	var lastRun = Number(fs.readFileSync("lastRun").toString('utf-8')),
	updateFile = new createJFM(lastRun || 0);
	//walk(base + "/js", ajt.create, lastRun);
 
	var ajt = new Concatenation( sourceDir, destinDir );
	ajt.concatenateJSFiles(files, {},  updateFile.create);
	fs.writeFile("lastRun", "" + Date.now(), function( ) {});
}
runall(process.argv);

function createJFM( lastRun ) {
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
	
	this.create = function( sFile, d ) {

		var stat = fs.statSync(sFile);
		//do not modify file if it has no change.
		if((new Date(stat.mtime).getTime()) < lastRun ){
			return;
		}
		d = d || fs.readFileSync(sFile).toString('utf-8');
		var data = executeFile(d);
		data && fs.writeFileSync(sFile, data, 'utf-8');
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
