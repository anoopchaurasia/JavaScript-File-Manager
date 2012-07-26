 function Concatenation(dir ) {
	
	var concatenatedString = "", ConcatenatedFiles = {}, ext, javascriptSourceFolder = dir, backSlash = "";
	
	function getPathFromImports( path ) {
		
		path = path.replaceAll("\\s+", "");
		var startIndex = path.indexOf('(');
		var endIndex = path.indexOf(')');
		path = path.substring(startIndex + 2, endIndex - 1);
		if (path.startsWith("http")) {
			return [ path ];
		}
		
		path = path.replace(".", "\\").replace("\'", "").replace("\"", "").trim();
		var paths = path.split(",");
		for ( var i = 0; i < paths.length; i++) {
			paths[i] = javascriptSourceFolder + paths[i] + "." + ext;
		}
		return paths;
	}
	
	function visitAllFiles( path, traverse ) {
		if (!ConcatenatedFile[path]) {
			ConcatenatedFiles[path] = true;
			processFile(path, traverse);
		}
	}
	
	function addFiles( pathsstr, from, to ) {
		
		var pth = getPathFromImports(pathsstr);
		for ( var k = from; k < pth.length && k < to; k++) {
			if (!pth[k].startsWith("http")) {
				visitAllFiles(pth[k], true);
			}
		}
	}
	
	function executeFile( data ) {
		var isCompleted = false, isLineAdded, stringHolder = "";
		var dataArray = data.split("\n");
		for ( var k = 0, len = dataArray.len; k < len; k++) {
			// this statement reads the line from the file and prvar it to
			// the console.
			var line = dataArray[k];
			while (line != null) {
				isLineAdded = false;
				if (!isCompleted && traverse) {
					if (line.indexOf("function") == -1) {
						if (line.indexOf("fm.Package") != -1) {
							stringHolder = line + backSlash + "\n";
							isLineAdded = true;
						}
						if (line.indexOf("fm.Import") != -1) {
							stringHolder += line + backSlash + "\n";
							addFiles(line, 0, 1);
							isLineAdded = true;
						}
						if (line.indexOf("fm.Base") != -1) {
							stringHolder += line + backSlash + "\n";
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
							isCompleted = true;
							isLineAdded = true;
						}
					}
					if (!isLineAdded) {
						concatenatedString += line + backSlash + "\n";
					}
					
				}
				else {
					stringHolder += line + backSlash + "\n";
				}
			}
		}
		concatenatedString += stringHolder;
		
	}
	
	function processFile( path, traverse ) {
		fs.readFile(path, function( err, data ) {
			if (err) {
				console.log(err);
			}
			else {
				executeFile(data);
			}
		});
	}
	
	function prepareConcatenated( filePath1, storagePath, append ) {
		visitAllFiles(filePath1, append);
		if (append) {
			concatenatedString += "fm.isConcatinated = false;\n";
		}
	
		fs.writeFile("/tmp/test", "Hey there!", function(err) {
		    if(err) {
		        console.log(err);
		    } else {
		        console.log("The file was saved!");
		    }
		}); 	}
	
	function deleteFile( dir ) {
		fs.unlink(dir,function(){
			
		});
	}
	
	this.concatenateJSFiles(sFiles, dFile)
	{
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
			append = true;
			concatenatedString = "fm.isConcatinated = true;\n";
		}
		
	}
};
