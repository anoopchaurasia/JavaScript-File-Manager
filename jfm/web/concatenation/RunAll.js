var fs = require('fs');
function Concatenation(dir) {

	var concatenatedString = "", ConcatenatedFiles = {}, javascriptSourceFolder = dir;

	function executeFile(data) {

		var result;
		var d = data.replace(/\s/g, ""), reg;

		if (d.indexOf("prototype.$add=function(obj,key,val,isConst)") != -1) {
			concatenatedString += data;
			return;
		}
		reg = /fm.import\((.*?)\)/gi;

		while (result = reg.exec(d)) {
			result = result[1];
			result = result.substring(1, result.length - 1).replace(/\./g, "/") + ".js";
			processFile(javascriptSourceFolder + result);
		}

		result = /fm.class\((.*?)\)/gi.exec(d) || /fm.Interface\((.*?)\)/gi.exec(d) || /fm.AbstractClass\((.*?)\)/gi.exec(d);
		if (result) {
			result = result[1];
			result = result.substring(1, result.length - 1).split(",")[1];
			if (result) {
				result = result.substring(1).trim().replace(/\./g, "/") + ".js";
				processFile(javascriptSourceFolder + result);
			}
		}

		reg = /fm.Implements\((.*?)\)/gi;
		if (result = reg.exec(d)) {
			result = result[1].split(",");

			for ( var k = 0; k < result.length; k++) {
				;
				processFile(javascriptSourceFolder + result[k].substring(1, result[k].length - 1).replace(/\./g, "/") + ".js");
			}
		}

		concatenatedString += data;
	}

	function processFile(path) {
		if (!ConcatenatedFiles[path]) {
			ConcatenatedFiles[path] = true;
			try{
				executeFile(fs.readFileSync(path).toString('utf-8'));
			}catch (e) {
				console.log(e);
			}
		}

	}

	function deleteFile(dir) {
		fs.unlink(dir, function() {
			// dfdfdf
		});
	}

	this.concatenateJSFiles = function(sFiles, dFile) {
		ext = "js";
		backSlash = "";
		deleteFile(dFile);
		concatenatedString += "isConcatinated = true;\n";
		ConcatenatedFiles = {};
		for ( var i = 0; i < sFiles.length; i++) {
			processFile(sFiles[i]);
		}
		concatenatedString += "isConcatinated = false;\n";
		fs.open(dFile, 'a', 666, function(e, id) {
			fs.write(id, concatenatedString, null, 'utf8', function() {
				fs.close(id, function() {
					console.log('file closed');
				});
			});
		});
	};
}
function runall( ) {
	require("./Test.js");

	var baseDir = "D:/workspace/jfm/web/javascript/", outputFile = "../contjs/Master.js";
	var inputFiles = [];
	inputFiles.push("D:/workspace/jfm/web/javascript/jfm/Master.js");
	inputFiles.push("D:/workspace/jfm/web/javascript/App.js");
	var ajt = new Concatenation(baseDir);
	ajt.concatenateJSFiles(inputFiles, outputFile);
}
runall();
