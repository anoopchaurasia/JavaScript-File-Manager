var fs = require('fs');
function Concatenation( dir ) {
	
	var concatenatedString = "", ext, javascriptSourceFolder = dir, backSlash = "";
	
	function getClassName( path, second ) {
		
		path = path.replace(/\\s/g, "");
		path = path.substring(path.indexOf('(') + 2, path.indexOf(')') - 1).replace(/\'/g, "").replace(/\"/g, "");
		if (second) {
			path = path.split(",")[1];
		}
		path = path && path.split(".");
		return path && path[path.length - 1];
	}
	
	function executeFile( data ) {
		var isCompleted = false, isLineAdded, stringHolder = "";
		var dataArray = data.split("\n"), add = true, num;
		var imports = [ 'me' ], s, skip;
		if ((num = data.replace(/\s/g, "").indexOf("this.setMe=function(_me){me=_me;}")) != -1) {
			add = false;
		}
		console.log(num);
		for ( var k = 0, len = dataArray.length; k < len; k++) {
			// this statement reads the line from the file and prvar it to
			// the console.
			var line = dataArray[k];
			isLineAdded = false;
			if (!isCompleted) {
				if (line.indexOf("function") == -1) {
					if (line.indexOf("fm.Import") != -1) {
						stringHolder += line + backSlash + "\n";
						imports.push(getClassName(line));
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
						s = true;
						var tempN = getClassName(line, true);
						if (tempN) {
							imports.push(tempN);
							imports.unshift('base');
						}
						isCompleted = true;
						isLineAdded = true;
					}
				}
				if (!isLineAdded) {
					concatenatedString += line + backSlash + "\n";
				}
				
			}
			else {
				if (s) {
					if (line.indexOf("(") != -1 && !skip) {
						var temp = line.substring(0, line.indexOf("(")) + "( " + imports.join(", ") + ")";
						stringHolder += temp + backSlash;
						skip = true;
						
					}
					if (line.indexOf("{") != -1) {
						var temp = "{";
						if (add) {
							temp += "this.setMe=function(_me){me=_me;};\n";
						}
						temp += line.substring(line.indexOf("{") + 1);
						s = false;
						stringHolder += temp + backSlash + "\n";
						skip = false;
						continue;
					}
				}
				if (skip) {
					continue;
				}
				stringHolder += line + backSlash + "\n";
			}
		}
		concatenatedString += stringHolder;
		
	}
	
	this.concatenateJSFiles = function( sFiles ) {
		ext = "js";
		backSlash = "";
		concatenatedString = "";
		executeFile(fs.readFileSync(sFiles).toString('utf-8'));
		fs.writeFile(sFiles, concatenatedString, function( ) {
		// asas
		});
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
	var ajt = new Concatenation(baseDir);
	debugger;
	lastRun = Number(fs.readFileSync("lastRun").toString('utf-8'));
	walk("D:/workspace/jfm/src/node", function( a, list ) {
		var t = Date.now();
		for ( var k = 0; k < list.length; k++) {
			ajt.concatenateJSFiles(list[k]);
		}
		fs.writeFile("lastRun", "" + Date.now(), function( ) {});
	}, lastRun);
	walk("D:/workspace/jfm/web/javascript", function( a, list ) {
		var t = Date.now();
		for ( var k = 0; k < list.length; k++) {
			ajt.concatenateJSFiles(list[k]);
		}
		fs.writeFile("lastRun", "" + Date.now(), function( ) {});
	}, lastRun);
	fs.writeFile("lastRun", "" + Date.now(), function( ) {});
}

var fs = require('fs');
var walk = function( dir, done, lastRun ) {
	var results = [];
	fs.readdir(dir, function( err, list ) {
		if (err)
			return done(err);
		var i = 0;
		(function next( ) {
			var file = list[i++];
			if (!file)
				return done(null, results);
			file = dir + '/' + file;
			fs.stat(file, function( err, stat ) {
				if (stat && stat.isDirectory()) {
					walk(file, function( err, res ) {
						results = results.concat(res);
						next();
					}, lastRun);
				}
				else {
					stat.mtime > lastRun && results.push(file);
					next();
				}
			});
		})();
	});
};
runall();
