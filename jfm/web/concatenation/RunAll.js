var fs = require('fs');
var IncludedInside = [];

function mkdir(path, root) {
	console.log("path:" + path, root);
	if(!path){
		return;
	}
    var dirs = path.split('/'), dir = dirs.shift(), root = (root||'')+dir+'/';

    try { fs.mkdirSync(root); }
    catch (e) {
        //dir wasn't made, something went wrong
        if(!fs.statSync(root).isDirectory()) throw new Error(e);
    }

    return !dirs.length||mkdir(dirs.join('/'), root);
}

function Concatenation(sourceDir, destinDir) {

	var  isConcatinatedAdded = false, concatenatedString = "", ConcatenatedFiles = {};

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
				processFile(sourceDir + result);
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
				;
				processFile(sourceDir + result[k].substring(1, result[k].length - 1).replace(/\./g, "/") + ".js");
			}
		}
		if (!isConcatinatedAdded) {
			isConcatinatedAdded = true;
			concatenatedString += "fm.isConcatinated = true; \n";
		}
		concatenatedString += data;
	}

	function processFile(path) {
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

	this.concatenateJSFiles = function(sFiles, concate) {
		ext = "js";
		backSlash = "";
		var len = sFiles.length;
		var dFile =  sFiles[len - 1];
		mkdir(dFile.substring(0,  dFile.lastIndexOf("/") ), destinDir);
		deleteFile(destinDir + dFile);
		
		concatenatedString += "";
		ConcatenatedFiles = {};
		for ( var i = 0; i < sFiles.length; i++) {
			processFile(sourceDir + sFiles[i]);
		}
		concatenatedString += "fm.isConcatinated = false;\n";
		fs.writeFileSync(destinDir + dFile, concatenatedString, 'utf8',  function(e) {
			console.log(e);
		});
		var s, fname;
		console.log(destinDir + dFile, IncludedInside);
		while(IncludedInside.length){
			fname = IncludedInside.pop();
			if(fname.indexOf('http') != -1){
				continue;
			}
			s =  fname + ".js";
			d =  fname.substring(fname.lastIndexOf("/") + 1) + ".js";
			 new Concatenation(sourceDir, destinDir).concatenateJSFiles([s], ConcatenatedFiles);
		}
	};
}

function runall() {
	require("./Test.js");
	var sourceDir = "D:/workspace/jfm/web/javascript/", destinDir =  "D:/workspace/jfm/web/contjs/";
	var inputFiles = [];
	inputFiles.push("jfm/Master.js");
	inputFiles.push("App.js");
	var ajt = new Concatenation(sourceDir, destinDir);
	ajt.concatenateJSFiles(inputFiles, {});
}
runall();


