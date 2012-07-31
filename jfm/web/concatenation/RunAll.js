var fs = require('fs');
function Concatenation( dir ) {
	
	var concatenatedString = "", ConcatenatedFiles = {}, ext, javascriptSourceFolder = dir, backSlash = "";
	
	function getPathFromImports( path, cl ) {
		
		path = path.replace("\\s+", "");
		var startIndex = path.indexOf('(');
		var endIndex = path.indexOf(')');
		path = path.substring(startIndex + 2, endIndex - 1);
		if (path.indexOf("http") == 0) {
			return [ path ];
		}
		
		path = path.replace(/\'/g, "").replace(/\"/g, "");
		if(cl){
			return path;
		}
		path = path.replace(/\./g, "/").trim();
		var paths = path.split(",");
		for ( var i = 0; i < paths.length; i++) {
			paths[i] = javascriptSourceFolder + paths[i].trim() + "." + ext;
		}
		return paths;
	}
	
	function visitAllFiles( path, traverse) {
		if (!ConcatenatedFiles[path]) {
			ConcatenatedFiles[path] = true;
			console.log(path);
			processFile(path, traverse);
		}
	}
	
	function addFiles( pathsstr, from, to ) {
		
		var pth = getPathFromImports(pathsstr);
		for ( var k = from; k < pth.length && k < to; k++) {
			if (!(pth[k].indexOf("http") == 0)) {
				visitAllFiles(pth[k], true);
			}
		}
	}
	
	function executeFile( data, traverse ) {
		
		
		
		
		var result;
		var d = data.replace(/\s/g, ""), reg;
		reg = /fm.import\((.*?)\)/gi;
		
		while (result = reg.exec(d)) {
			result = result[1];
			result = result.substring(1, result.length - 1).replace(/\./g, "/") + ".js";
			visitAllFiles(javascriptSourceFolder+result, true);
		}
		
		result = /fm.class\((.*?)\)/gi.exec(d) || /fm.Interface\((.*?)\)/gi.exec(d) || /fm.AbstractClass\((.*?)\)/gi.exec(d);
		if (result) {
			result = result[1];
			result = result.substring(1, result.length - 1).split(",")[1];
			if (result) {
				result = result.substring(1).trim().replace(/\./g, "/") + ".js";
				visitAllFiles(javascriptSourceFolder + result, true);
			}
		}
		
		
		
		reg = /fm.Implements\((.*?)\)/gi;
		if (result = reg.exec(d)) {
			result = result[1].split(",");
			
			for(var k =0; k < result.length; k++){
				;
				visitAllFiles(javascriptSourceFolder + result[k].substring(1, result[k].length - 1).replace(/\./g, "/") + ".js", true);
			}
		}
		
		concatenatedString += data;
	}
	
	function processFile( path, traverse ) {
		executeFile(fs.readFileSync(path).toString('utf-8'), traverse);
	}
	
	function prepareConcatenated( filePath1, append ) {
		visitAllFiles(filePath1, append, filePath1);
	}
	
	function deleteFile( dir ) {
		fs.unlink(dir, function( ) {
		// dfdfdf
		});
	}
	
	this.concatenateJSFiles = function( sFiles, dFile ) {
		ext = "js";
		backSlash = "";
		deleteFile(dFile);
		// String[] commands;
		// Runtime rt = Runtime.getRuntime();
		concatenatedString = "";
		ConcatenatedFiles = {};
		var append = false;
		for ( var i = 0; i < sFiles.length; i++) {
			prepareConcatenated(sFiles[i], dFile, append);
			if (append) {
				concatenatedString += "fm.isConcatinated = false;\n";
			}
			append = true;
			concatenatedString += "fm.isConcatinated = true;\n";
		}
		fs.open(dFile, 'a', 666, function( e, id ) {
			fs.write(id, concatenatedString, null, 'utf8', function( ) {
				fs.close(id, function( ) {
					console.log('file closed');
				});
			});
		});
	};
}

function runall( ) {
	//require("./Test.js");
	var baseDir = "D:/workspace/jfm/web/javascript/", outputFile = "../contjs/Master.js";
	var inputFiles = [];
	inputFiles.push("../javascript/jfm/Master.js");
	inputFiles.push("../javascript/App.js");
	var ajt = new Concatenation(baseDir);
	ajt.concatenateJSFiles(inputFiles, outputFile);
}
runall();
