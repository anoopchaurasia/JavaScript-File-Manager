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
	
	function visitAllFiles( path, traverse, cl ) {
		if (!ConcatenatedFiles[path]) {
			ConcatenatedFiles[path] = true;
			processFile(path, traverse, cl);
		}
	}
	
	function addFiles( pathsstr, from, to ) {
		
		var pth = getPathFromImports(pathsstr);
		for ( var k = from; k < pth.length && k < to; k++) {
			if (!(pth[k].indexOf("http") == 0)) {
				visitAllFiles(pth[k], true, getPathFromImports(pathsstr, true));
			}
		}
	}
	
	function executeFile( data, traverse, cl ) {
		var isCompleted = false, isLineAdded, stringHolder = "";
		var dataArray = data.split("\n");
		var imports = ['me'], s, skip;
		console.log("Comming", traverse);
		for ( var k = 0, len = dataArray.length; k < len; k++) {
			// this statement reads the line from the file and prvar it to
			// the console.
			var line = dataArray[k];
			isLineAdded = false;
			if (!isCompleted) {
				if (line.indexOf("function") == -1) {
					if (line.indexOf("fm.Package") != -1) {
						stringHolder = line + backSlash + "\n";
						isLineAdded = true;
					}
					if (line.indexOf("fm.Import") != -1) {
						stringHolder += line + backSlash + "\n";
						var t = line.split(".");
						imports.push(t[t.length-1].replace("\"","").replace(")","").replace(";",""));
						isLineAdded = true;
					}
					if (line.indexOf("fm.Base") != -1) {
						stringHolder += line + backSlash + "\n";
						var t = line.split(".");
						imports.unshift('base');
						//imports.push(t[t.length-1].replace("\"","").replace(")","").replace(";",""));
						isLineAdded = true;
					}
					if (line.indexOf("fm.Include") != -1) {
						stringHolder += line + backSlash + "\n";
						isLineAdded = true;
					}
					if (line.indexOf("fm.Implements") != -1) {
						stringHolder += line + backSlash + "\n";
						isLineAdded = true;
					}
					if ((line.indexOf("fm.Class") != -1 || line.indexOf("fm.Interface") != -1 || line.indexOf("fm.AbstractClass") != -1)) {
						stringHolder += line + backSlash + "\n";
						s=true;
						isCompleted = true;
						isLineAdded = true;
					}
				}
				if (!isLineAdded) {
					concatenatedString += line + backSlash + "\n";
				}
				
			}
			else {
				if(s){
					console.log(imports);
					if(line.indexOf("(") !=-1){
						var temp =  line.substring(0,line.indexOf("(")) +"( " + imports.join(", ")+ ")";
						stringHolder += temp + backSlash + "\n";
						
						skip = true;
						
					}
					if(line.indexOf("{")!= -1){
						var temp = "{";
						if( line.indexOf("this.setMe") == -1){
							temp +=  "this.setMe=function(){me=this;}";
						}
						temp +=  line.substring(line.indexOf("{")+1);
						s=false;
						stringHolder += temp + backSlash + "\n";
						skip = false;
						continue;
					}
				}
				if(skip){
					continue;
				}
				line.replace("this.setMe=function(){me=this;}","");
				stringHolder += line + backSlash + "\n";
			}
		}
		concatenatedString += stringHolder;
		
	}
	
	function processFile( path, traverse, cl ) {
		executeFile(fs.readFileSync(path).toString('utf-8'), traverse, cl);
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
		var append = true;
		for ( var i = 0; i < sFiles.length; i++) {
			prepareConcatenated(sFiles[i], dFile, append);
			if (append) {
				concatenatedString += "";
			}
			append = true;
			concatenatedString += "";
		}
		//fs.open(sFiles, 'a', 666, function( e, id ) {
			fs.writeFile(sFiles, concatenatedString, function( ) {
				
			});
		//});
	};
};

function runall( ) {
	var baseDir = "D:/workspace/jfm/src/node/", outputFile = "../contjs/Test.js";
	var inputFiles = [];
	for ( var i = 0; i < arguments.length; i++) {
		if (arguments[i].equals("-b")) {
			baseDir = arguments[++i];
			System.out.println("Base dir " + arguments[i]);
		}
		else if (arguments[i].equals("-o")) {
			outputFile = arguments[++i];
			System.out.println("Output File " + arguments[i]);
		}
		else if (!arguments[i].equals("-s")) {
			inputFiles.push(arguments[i]);
			System.out.println("Sourse File " + arguments[i]);
		}
	}
	inputFiles.push("../../src/node/App.js");
	var ajt = new Concatenation(baseDir);
	debugger;
	ajt.concatenateJSFiles(inputFiles);
};
runall();
