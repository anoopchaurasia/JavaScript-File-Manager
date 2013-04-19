(function(win, isnode){
	//
	if(win.fm && win.fm['package']){
		console.log("fm is already initialized");
		return ;
	}
	//Intializing fm as empty object
	win.fm = {};

	// assuming base directory is current directory 
	window.fm.basedir = ".";

	// /window.fm.import adds new javascript file to head of document. JAVA:
	// import
	win.fm['import'] = win.fm.Import = function Import( path ) {
		path = path.replace(/\s/g, "");
		add(path);
		this.Include(path); // function
		return this;
	};

	var scriptArr = [];

	// Add imports for current loaded javascript file.
	// Add imported javascript file for current class into currentScript.
	function add( path ) {
		
		var script = scriptArr[scriptArr.length - 1];
		script && (!script.imports && (script.imports = []));
		// checking if same file imported twice for same Class.
		for ( var k = 0, len = script.imports.length; k < len; k++) {
			if (script.imports[k] == path) {
				return this;
			}
		}
		script.imports.push(path);
	}
	

	win.fm.file_path  = [];
	var storePath = win.fm.file_path;
	// /same as fm.import but for non jfm files.
	win.fm['include'] = win.fm.Include = function Include( ) {
		var args = [];
		for (var k =1; k < arguments.length; k++){
			args.push(arguments[k]);
		}
		var path = arguments[0];
		var temp = fm.basedir.replace(/\//gim,"");
		if (!storePath[temp+ path]) {
			storePath[temp + path] = args || true;
		}
		else {
			if(typeof args[args.length -1] == 'function'){
				args.pop()();
			}
			return this;
		}

		path = path.replace(/\s/g, "");
		if (path.indexOf("http") != 0 && path.lastIndexOf(".js") != path.length - 3) {
			path = fm.basedir + "/" + path.split(".").join("/") + ".js";
			if(fm.isMinified){
				path += "min.js";
			}
		}
		if(isnode){
			include_for_node(path, args);
		}
		else{
			include(path);
		}
		return this;
	};

	// Create script tag inside head.
	function include_for_node( path, data) {
		scriptArr.push({
			packageName : ""
		});
		require(path);
	}

	var docHead = null;
	// Create script tag inside head.
	function include( path ) {

		if (fm.isConcatinated && path.indexOf("http") != 0) {
			return this;
		}

		if (!docHead) {
			docHead = document.getElementsByTagName("head")[0];
		}
		// isNonfm && fm.holdReady(true);
		var e = document.createElement("script");
		// onerror is not supported by IE so this will throw exception only for
		// non IE browsers.

		if(fm.version){
			path += "?v=" + fm.version;
		}
		e.onerror = function ( ) {
			console.error("Unable to load file: " + this.src + ". Please check the file name and parh.");
		};
		e.src = path;
		e.type = "text/javascript";
		docHead.appendChild(e);
	}

	// This should be first method to be called from jfm classes.JAVA:package
	window.fm["package"] = window.fm.Package = function Package( packageName ) {
		scriptArr.pop();
		var script = {
			packageName : packageName || ""
		};
		scriptArr.push(script);
		return this;
	};

	// / this method Add base class for current Class.JAVA:extend
	window.fm['super'] = window.fm['base'] = window.fm.Base = function Base( baseClass ) {
		var script = scriptArr[scriptArr.length - 1];
		script && (script.baseClass = baseClass) && this.Import(baseClass);
		return this;
	};
	
	// Set current script as Interface; JAVA:interface
	window.fm["interface"] = window.fm.Interface = function Interface( ) {
		var script = scriptArr[scriptArr.length - 1];
		script.isInterface = true;
		this.Class.apply(this, arguments);
	};

	window.fm['abstractClass'] = window.fm.AbstractClass = function( ) {
		var script = scriptArr[scriptArr.length - 1];
		script.isAbstract = true;
		this.Class.apply(this, arguments);
	};

	// Add all implemented interface to class interface list. and import
	// them.JAVA:implements
	window.fm['implements'] = window.fm.Implements = function Implements( ) {
		
		var script = scriptArr[scriptArr.length - 1];
		script.interfaces = script.interfaces || [];
		for ( var k = 0, len = arguments.length; k < len; k++) {
			this.Import(arguments[k]);
			script.interfaces.push(arguments[k]);
		}
	};

	// window.fm.Class creates a jfm class.
	window.fm['class'] = window.fm["Class"] = function Class( ){

		var script = scriptArr.pop();
		var a = arguments, o = null;
		script.className = a[0];
		if (a[1]) {
			this.Base(a[1]);
		}
		o = createObj("" + script.packageName);
		script.Class = "" + (script.packageName == "" ? "" : script.packageName + ".") + script.className;
		script.Package = o;

		var temp = fm.basedir.replace(/\//gim,"");
		if (typeof storePath[temp  + script.Class] == 'object') {
			data = storePath[temp  + script.Class];
			storePath[temp  + script.Class] = true;
		}		
		callAfterDelay(script, data, o[script.className]);
	};

	// callAfterDelay:Delay the call for classManager so that file get compiled
	// completely.
	// And classManager get all information about the function.
	function callAfterDelay( script, data,  older) {
		setTimeout(function( ) {
			// Calling classmanager after a short delay so that file get
			// completely ready.
			classManager(script, data, older);
			// fm.holdReady(false);
		}, 0);
	}


	// fm.stringToObject: map a string into object.
	fm.stringToObject = function stringToObject( classStr, Class ) {
		 Class = Class || window, classStrArr = classStr.split(".");
		for ( var n = 0; Class && n < classStrArr.length; n++) {
			Class = Class[classStrArr[n]];
		}
		return Class;
	};


	// Map string to corresponding object.
	function createObj( str ) {
		if (!str || str.length == 0) {
			return window;
		}
		var d = str.split("."), j, o = window;
		for (j = 0; j < d.length; j = j + 1) {
			o[d[j]] = o[d[j]] || {};
			o = o[d[j]];
		}
		return o;
	}

	// return all imported classes string into object
	function getAllImportClass( imp ) {
		var newImports = {}, splited;
		for ( var k = 0; imp && k < imp.length; k++) {
			splited = imp[k].split(".");
			newImports[splited[splited.length - 1]] = window.fm.stringToObject(imp[k]);
		}
		return newImports;
	}

	var saveState = [];
	
	// Add information before calling the class.
	function addPrototypeBeforeCall( Class, isAbstract ) {
		
		saveState.push(window.Static, window.Abstract, window.Const, window.Private);
		Static = Class.prototype.Static = {};
		Abstract = Class.prototype.Abstract = isAbstract ? {} : undefined;
		Const = Class.prototype.Const = {};
		Const.Static = Static.Const = {};
		Private = Class.prototype.Private = {};
	}
	
	// Delete all added information after call.
	function deleteAddedProtoTypes( Class ) {
		
		delete Class.prototype.Static;
		delete Class.prototype.Const;
		delete Class.prototype.Private;
		delete Class.prototype.Abstract;
		Private = saveState.pop();
		Const = saveState.pop();
		Abstract = saveState.pop();
		Static = saveState.pop();
	}


	// Contain all classses dependent on a class with className {id};
	// method to check if Object.defineProperty supported by browser.
	// IE8 support Object.defineProperty only for dom object.
	function doesDefinePropertyWork( object ) {
		try {
			Object.defineProperty(object, "a", {});
			return "a" in object;
		}
		catch (e) {
			return false;
		}
	}

	// Checking if setter and getter is supported by browser.
	var isGetterSetterSupported = isnode || doesDefinePropertyWork({}) || Object.prototype.__defineGetter__;

	function creareSetGet( classProto ) {
		// Storing key:value in separate variable as using original object will
		// create infinit loop.
		var valueStorage = {};
		// Static is not supported.... will not support ie < 9;
		// Adding setter and getter
		classProto.prototype.$add = function( obj, key, val, isConst ) {

			// val has a value for it's original object.
			if (val != undefined) {
				valueStorage[key] = val;
			}

			function setter( newval ) {
				if (isConst) {
					throw this + "." + key + " can not be changed.";
				}
				valueStorage[key] = newval;
			}

			function getter( ) {
				return valueStorage[key];
			}
			obj[key] = null;
			if (Object.defineProperty && isGetterSetterSupported) {
				obj[key] = obj[key];
				Object.defineProperty(obj, key, {
				    get : getter,
				    set : setter
				});
			}
			else if (obj.__defineGetter__) {
				obj.__defineGetter__(key, getter);
				obj.__defineSetter__(key, setter);
			}
			else {
				obj[key] == undefined && (obj[key] = valueStorage[key]);
			}
		};
	}
	
	// Extend to one level.
	function simpleExtend( from, to ) {
		for ( var k in from) {
			if (to[k] == undefined) {
				to[k] = from[k];
			}
		}
		return to;
	}

	// Check if same property already available in object for static and Const;
	function checkAvailability( obj ) {
		for ( var k = 1, len = arguments.length; k < len; k++) {
			for ( var m in arguments[k]) {
				if (obj.hasOwnProperty(m)) {
					throw obj.getClass() + ": has " + m + " at more than one places";
				}
			}
		}
	}

	// Separate all methods and fields of object;
	function separeteMethodsAndFields( obj ) {
		var methods = [], fields = {};
		eachPropertyOf(obj, function( v, k ) {
			if (typeof v == 'function') {
				methods.push(k + "");
			}
			else {
				fields[k + ""] = v;
			}
		});
		obj = undefined;
		return {
		    methods : methods,
		    fields : fields
		};
	}
	
	function checkForAbstractFields( abs, cls ) {
		eachPropertyOf(abs, function( v, k ) {
			if (typeof v != 'function') {
				throw cls + ": can not contain abstract fields.";
			}
		});
	}

	function checkMandSetF( pofn ) {
		
		// check if methods are implemeted and add fields;
		pofn.prototype.$checkMAndGetF = function( pofnS, allMethods, isAbstract, cls ) {
			var temp = {}, k, len;
			var intPofnM = pofn.prototype.$get('methods');
			if (isAbstract) {
				var abs = cls.Abstract;
				for (k = 0, len = intPofnM.length; k < len; k++) {
					if (!abs[intPofnM[k]]) {
						abs[intPofnM[k]] = function( ) {};
					}
				}
			}
			else {
				for (var k = 0, len = allMethods.length; k < len; k++) {
					temp[allMethods[k]] = true;
				}
				
				for (var k = 0, len = intPofnM.length; k < len; k++) {
					if (!temp[intPofnM[k]]) {
						throw "Interface method " + intPofnM[k] + " of " + pofn.getClass() + " not implemented by " + pofnS.getClass();
					}
				}
			}
			
			eachPropertyOf(pofn.prototype.$get('fields'), function( v, k ) {
				pofn.prototype.$add(pofnS, k, v, true, true);
			});
		};
	}
	
	// Change the context of function.
	function changeContext( fun, context, bc ) {
		return function( ) {
			var temp = fun.apply(context, arguments);
			bc && (temp = bc());
			return temp;
		};
	}
	

});