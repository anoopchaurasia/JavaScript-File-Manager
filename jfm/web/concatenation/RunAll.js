var fs = require('fs');
var IncludedInside = [];
function Concatenation(dir) {

	var  isConcatinatedAdded = false, concatenatedString = "", ConcatenatedFiles = {}, javascriptSourceFolder = dir;

	function executeFile(data) {

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
				processFile(javascriptSourceFolder + result);
			}
		}

		reg = /fm.include\((.*?)\)/gi;
		var index;
		while (result = reg.exec(d)) {
			index = result.index;
			result = result[1];
			result = result.substring(1, result.length - 1).replace(/\./g, "/") + ".js";
			if(index > classIndex){
				IncludedInside.push(result.split(",")[0].replace(/"/gm,''));
				continue;
			}
			processFile(javascriptSourceFolder + result);
		}

		reg = /fm.import\((.*?)\)/gi;
		
		while (result = reg.exec(d)) {
			result = result[1];
			result = result.substring(1, result.length - 1).replace(/\./g, "/") + ".js";
			processFile(javascriptSourceFolder + result);
		}


		reg = /fm.Implements\((.*?)\)/gi;
		if (result = reg.exec(d)) {
			result = result[1].split(",");

			for ( var k = 0; k < result.length; k++) {
				;
				processFile(javascriptSourceFolder + result[k].substring(1, result[k].length - 1).replace(/\./g, "/") + ".js");
			}
		}
		if (!isConcatinatedAdded) {
			isConcatinatedAdded = true;
			concatenatedString += "fm.isConcatinated = true; \n";
		}
		concatenatedString += data;
	}

	function processFile(path) {
		console.log(path);
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

	function deleteFile(dir) {
		fs.unlink(dir, function() {
			// dfdfdf
		});
	}

	this.concatenateJSFiles = function(sFiles, dFile) {
		ext = "js";
		backSlash = "";
		deleteFile(dFile);
		concatenatedString += "";
		ConcatenatedFiles = {};
		for ( var i = 0; i < sFiles.length; i++) {
			processFile(sFiles[i]);
		}
		concatenatedString += "fm.isConcatinated = false;\n";
		console.log( dFile);
		fs.writeFileSync(dir + dFile, concatenatedString, 'utf8',  function(e) {
			console.log(e);
		});
		var s,d, fname;
		console.log(IncludedInside);
		while(IncludedInside.length){
			fname = IncludedInside.pop();
			if(fname.indexOf('http') != -1){
				continue;
			}
			s = "D:/workspace/jfm/web/javascript/" + fname + ".js";
			d = "../contjs/"+ fname.substring(fname.lastIndexOf("/") + 1) + ".js";
			console.log(s, d);
			 new Concatenation(dir).concatenateJSFiles([s], d);
		}
	};
}
function runall() {
	require("./Test.js");
	var baseDir = "D:/workspace/jfm/web/javascript/", outputFile = "../contjs/Master.js";
	var inputFiles = [];
	inputFiles.push("D:/workspace/jfm/web/javascript/jfm/Master.js");
	inputFiles.push("D:/workspace/jfm/web/javascript/App.js");
	var ajt = new Concatenation(baseDir);
	ajt.concatenateJSFiles(inputFiles, outputFile);
}
runall();
