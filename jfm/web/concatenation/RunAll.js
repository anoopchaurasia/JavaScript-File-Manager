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
		var imports = ['me', 'base'], s, skip;
	
		for ( var k = 0, len = dataArray.length; k < len; k++) {
			// this statement reads the line from the file and prvar it to
			// the console.
			var line = dataArray[k];
			isLineAdded = false;
			if (!isCompleted && traverse) {
				if (line.indexOf("function") == -1) {
					if (line.indexOf("fm.Package") != -1) {
						stringHolder = line + backSlash + "\n";
						isLineAdded = true;
					}
					if (line.indexOf("fm.Import") != -1) {
						stringHolder += line + backSlash + "\n";
						var t = line.split(".");
						imports.push(t[t.length-1].replace("\"","").replace(")","").replace(";",""));
						addFiles(line, 0, 1);
						isLineAdded = true;
					}
					if (line.indexOf("fm.Base") != -1) {
						stringHolder += line + backSlash + "\n";
						var t = line.split(".");
						imports.push(t[t.length-1].replace("\"","").replace(")","").replace(";",""));
						addFiles(line, 0, 1);
						isLineAdded = true;
					}
					if (line.indexOf("fm.Include") != -1) {
						stringHolder += line + backSlash + "\n";
						addFiles(line, 0, 1);
						isLineAdded = true;
					}
					if (line.indexOf("fm.Implements") != -1) {
						stringHolder += line + backSlash + "\n";
						addFiles(line, 0, 999);
						isLineAdded = true;
					}
					if ((line.indexOf("fm.Class") != -1 || line.indexOf("fm.Interface") != -1 || line.indexOf("fm.AbstractClass") != -1)) {
						stringHolder += line + backSlash + "\n";
						addFiles(line, 1, 2);
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
					if(line.indexOf("(") !=-1){
						var temp =  line.substring(0,line.indexOf("(")) +"( " + imports.join(", ")+ ")";
						stringHolder += temp + backSlash + "\n";
						skip = true;
						
					}
					if(line.indexOf("{")!= -1){
						var temp =  "{this.setMe=function(){me=this;}" + line.substring(line.indexOf("{")+1);
						s=false;
						stringHolder += temp + backSlash + "\n";
						skip = false;
						continue;
					}
				}
				if(skip){
					continue;
				}
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
};

function runall( ) {
	var baseDir = "D:/workspace/jfm/web/javascript/", outputFile = "../contjs/Master.js";
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
	inputFiles.push("../javascript/jfm/Master.js");
	inputFiles.push("../javascript/App.js");
	var ajt = new Concatenation(baseDir);
	debugger;
	ajt.concatenateJSFiles(inputFiles, outputFile);
};
runall();
