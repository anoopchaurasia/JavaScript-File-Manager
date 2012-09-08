/**
 * Created by JetBrains WebStorm. User: Anoop Date: 5/7/11 Time: 11:14 PM To
 * change this template use File | Settings | File Templates.
 */

(function( window, undefined ) {
	if(window.fm && window.fm['package']){
		return ;
	}
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
	
	if (!Function.prototype.bind) {
		Function.bind = Function.prototype.bind = function( obj ) {
			var thisFun = this;
			return function( ) {
				return thisFun.apply(obj, arguments);
			};
		};
	}
	
	// Checking if setter and getter is supported by browser.
	var isGetterSetterSupported = doesDefinePropertyWork({}) || Object.prototype.__defineGetter__;
	
	// This method is adding a $add method into class prototype wchich is being
	// used to create setter and getter for its own property.
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
			
			if (obj.__defineGetter__) {
				obj.__defineGetter__(key, getter);
				obj.__defineSetter__(key, setter);
			}
			else if (Object.defineProperty && isGetterSetterSupported) {
				Object.defineProperty(obj, key, {
				    get : getter,
				    set : setter
				});
			}
			else {
				obj[key] == undefined && (obj[key] = valueStorage[key]);
			}
		};
	}
	
	// intializing fm
	if (!window.fm) {
		window.fm = {};
	}
	// currentScript is being used to contain all information of currently
	// loaded JavaScript file.
	var currentScript;
	// Assuming JavaScript base directory is "javascript".
	
	fm.basedir = "/javascript";
	
	// fm.stackTrace can be used to collect to print function stack;
	// JAVA:Exception.stacktrace
	fm.stackTrace = function( message ) {
		try {
			if (message) {
				console.error(message);
			}
			var a = arguments.callee, str = "";
			while (a.caller) {
				if (a.caller.getName) {
					str += a.caller.getName() + " of " + a.caller.$Class + "\n";
				}
				else if (a.caller.name != "") {
					str += a.caller.name + "\n";
				}
				a = a.caller;
			}
			console.log(str);
			var k = ty;
		}
		catch (e) {
			console.error(e.stack && e.stack.substring(e.stack.indexOf("\n")));
			// System.out.println(e.stack &&
			// e.stack.substring(e.stack.indexOf("\n")));
		}
	};
	
	// /fm.import adds new javascript file to head of document. JAVA: import
	fm['import'] = fm.Import = function Import( path ) {
		path = path.replace(/\s/g, "");
		add(path);
		this.Include(path); // function
		return this;
	};
	
	// Keep track of loaded files in storePath.
	var storePath = [];
	
	// /same as fm.import but for non jfm files.
	fm['include'] = fm.Include = function Include( ) {
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
			return this;
		}
		if (fm.isConcatinated && path.indexOf("http") != 0) {
			return this;
		}
		path = path.replace(/\s/g, "");
		if (path.indexOf("http") != 0 && path.lastIndexOf(".js") != path.length - 3) {
			path = fm.basedir + "/" + path.split(".").join("/") + ".js";
		}
		include(path);
		return this;
	};
	
	// /onReadyState method get called when browser fail to load a javascript
	// file.
	function onReadyState( ) {
		console.error("Unable to load file: " + this.src + ". Please check the file name and parh.");
		// fm.holdReady(false);
		return false;
	}
	
	// Add imports for current loaded javascript file.
	// Add imported javascript file for current class into currentScript.
	function add( path ) {
		!currentScript && fm.Package();
		var script = currentScript;
		script && (!script.imports && (script.imports = []));
		// checking if same file imported twice for same Class.
		for ( var k = 0, len = script.imports.length; k < len; k++) {
			if (script.imports[k] == path) {
				return this;
			}
		}
		script.imports.push(path);
		return true;
	}
	var docHead;
	
	// Create script tag inside head.
	function include( path ) {
		if (!docHead) {
			docHead = document.getElementsByTagName("head")[0];
		}
		// isNonfm && fm.holdReady(true);
		var e = document.createElement("script");
		// onerror is not supported by IE so this will throw exception only for
		// non IE browsers.
		e.onerror = onReadyState;
		e.src = path;
		e.type = "text/javascript";
		docHead.appendChild(e);
		
	}
	
	// This should be first method to be called from jfm classes.JAVA:package
	fm["package"] = fm.Package = function Package( packageName ) {
		currentScript = {
			packageName : packageName || ""
		};
		return this;
	};
	
	// / this method Add base class for current Class.JAVA:extend
	fm['super'] = fm['base'] = fm.Base = function Base( baseClass ) {
		currentScript && (currentScript.baseClass = baseClass) && this.Import(baseClass);
		return this;
	};
	
	// Set current script as Interface; JAVA:interface
	fm["interface"] = fm.Interface = function Interface( ) {
		!currentScript && this.Package();
		currentScript.isInterface = true;
		this.Class.apply(this, arguments);
	};
	
	fm['abstractClass'] = fm.AbstractClass = function( ) {
		!currentScript && this.Package();
		currentScript.isAbstract = true;
		this.Class.apply(this, arguments);
	};
	// Add all implemented interface to class interface list. and import
	// them.JAVA:implements
	fm['implements'] = fm.Implements = function Implements( ) {
		!currentScript && this.Package();
		var script = currentScript;
		script.interfaces = script.interfaces || [];
		for ( var k = 0, len = arguments.length; k < len; k++) {
			this.Import(arguments[k]);
			script.interfaces.push(arguments[k]);
		}
	};
	
	fm.isExist = function( cls ) {
		var s = cls.split(".");
		var o = window;
		for ( var k in s) {
			if (!o[s[k]]) {
				return false;
			}
			o = o[s[k]];
		}
		if(typeof o == 'function' && o.name == '___manager___'){
			return true;
		}
		return false;
	};
	
	// fm.Class creates a jfm class.
	fm['class'] = fm["Class"] = function Class( ){ 
		!currentScript && this.Package();
		var script = currentScript, data;
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
		currentScript = undefined;
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
		});
	}
	
	// fm.stringToObject: map a string into object.
	fm.stringToObject = function stringToObject( classStr ) {
		var Class = window, classStrArr = classStr.split(".");
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
	
	// Contain all classses dependent on a class with className {id};
	var classDependent = {};
	// Call all callbacks after a class get ready so that dependent can
	// complete.
	function iamready( id, obj ) {
		if (classDependent[id]) {
			for ( var k = 0, len = classDependent[id].length; k < len; k++) {
				classDependent[id][k](id, obj);
			}
		}
		classDependent[id] = {
			classObj : obj
		};
	}
	
	// Store all callbacks dependent on class with name {id}.
	function onFileReady( id, cb ) {
		classDependent[id] = classDependent[id] || [];
		classDependent[id].push(cb);
	}
	
	// return clas if class with name {id} is ready.
	function isReady( id ) {
		return classDependent[id];
	}
	
	// return all imported classes string into object
	function getAllImportClass( imp ) {
		var newImports = {}, splited;
		for ( var k = 0; imp && k < imp.length; k++) {
			splited = imp[k].split(".");
			newImports[splited[splited.length - 1]] = fm.stringToObject(imp[k]);
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
	
	// Return whether object is empty.
	function isNotAEmptyObject( obj ) {
		for ( var k in obj) {
			if (obj.hasOwnProperty(k)) {
				return true;
			}
		}
		return false;
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
	
	// add all transient fields to list.
	function addTransient( internalObj, tempObj ) {
		var temp = {}, k, tr = tempObj["transient"] || [];
		tr.push("shortHand");
		for (k = 0; k < tr.length; k++) {
			(temp[tr[k]] = true);
		}
		eachPropertyOf(internalObj.Static, function( v, key ) {
			temp[key] = true;
		});
		eachPropertyOf(internalObj.staticConst, function( v, key ) {
			temp[key] = true;
		});
		internalObj["transient"] = temp;
		internalObj = tempObj = k = temp = undefined;
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
				for (k = 0, len = allMethods.length; k < len; k++) {
					temp[allMethods[k]] = true;
				}
				
				for (k = 0, len = intPofnM.length; k < len; k++) {
					if (!temp[intPofnM[k]]) {
						throw "Interface method " + intPofnM[k] + " of " + pofn.getClass() + " not implemented by " + pofnS.getClass();
					}
				}
			}
			
			eachPropertyOf(pofn.prototype.$get('fields'), function( v, key ) {
				pofn.prototype.$add(pofnS, key, v, true, true);
			});
		};
	}
	window.me = window.base = undefined;
	
	// Change the context of function.
	function changeContext( fun, context, bc ) {
		return function( ) {
			fun.apply(context, arguments);
			bc();
		};
	}
	
	function defaultConstrct( ) {
		if (arguments.length > 0) {
			fm.stackTrace("Class does not have any constructor ");
		}
	}
	
	function addShortHand( str, protoClass ) {
		var indx = str.lastIndexOf(".");
		var o = createObj(str.substring(0, indx));
		var nam = str.substring(1 + indx);
		if (o[nam]) {
			console.error("Short hand " + str + " for " + protoClass + " has conflict with. " + o[nam]);
		}
		o[nam] = protoClass;
	}
	
	// Wait for resource to be ready
	function addImportsOnready( implist, cb, fn ) {
		var counter = 0, complete;
		function decreaseCounter( ) {
			counter--;
			if (counter == 0 && complete) {
				cb();
			}
		}
		for ( var k = 0; implist && k < implist.length; k++) {
			counter++;
			var Class = isReady(implist[k]);
			if (Class && 'classObj' in Class) {
				decreaseCounter();
			}
			else {
				onFileReady(implist[k], function( obj, id ) {
					decreaseCounter();
				});
			}
		}
		complete = true;
		if (counter == 0) {
			cb();
		}
	}
	
	// Reeturn base class object.
	function getBaseClassObject( base, $arr ) {
		function addAllBaseInfo( ) {
			var v, arr = $arr;
			var proto = baseClassObject.prototype;
			var constList = proto.$get("Const"), isConst;
			for ( var k in baseClassObject) {
				if (baseClassObject.hasOwnProperty(k)) {
					isConst = constList.hasOwnProperty(k);
					v = baseClassObject[k];
					if (typeof v == 'function') {
						if (k == '$add') {
							continue;
						}
						for ( var l = arr.length - 1; l >= 0; l--) {
							if (arr[l][k] != undefined)
								break;
							arr[l][k] = v;
						}
					}
					else {
						isConst && baseClassObject.$add(baseClassObject, k, v, isConst);
						for ( var m = arr.length - 1; m >= 0; m--) {
							if (arr[m][k] != undefined)
								break;
							baseClassObject.$add(arr[m], k, undefined, isConst);
						}
					}
				}
			}
			// deleteing $add as all operations on $add are completed for this
			// instance.
			delete baseClassObject.$add;
			var currentClass = arr.pop();
			return currentClass.base = baseClassObject;
		}
		
		base.prototype.get$arr = function( ) {
			return $arr;
		};
		base.prototype.__base___ = true;
		var baseClassObject = new base();
		delete base.prototype.__base___;
		delete base.prototype.get$arr;
		var baseObj = changeContext(baseClassObject.constructor, baseClassObject, addAllBaseInfo);
		baseObj.prototype = baseClassObject;
		baseObj.$ADD = function( o ) {
			$arr.unshift(o);
			delete baseObj.$ADD;
		};
		return baseObj;
	}
	
	// Return the function name.
	window.getFunctionName = function( ) {
		return arguments.callee.caller.name;
	};
	
	function eachPropertyOf( obj, cb ) {
		if (typeof obj != 'null') {
			for ( var k in obj) {
				if (obj.hasOwnProperty(k)) {
					cb(obj[k], k);
				}
			}
		}
	}
	
	function addInstance( currentObj ) {
		var valueStorage = {};
		// Adding into instance as prototype is shared by all.
		currentObj.$add = function( obj, key, val, isConst ) {
			
			if (val != undefined) {
				valueStorage[key] = val;
			}
			function setter( v ) {
				if (isConst) {
					throw this + "." + key + " can not be changed.";
				}
				else if (isConst) {
					valueStorage[key] = v;
				}
				else {
					currentObj[key] = v;
				}
			}
			
			function getter( ) {
				if (isConst) {
					return valueStorage[key];
				}
				return currentObj[key];
			}
			
			if (obj.__defineGetter__) {
				obj.__defineGetter__(key, getter);
				obj.__defineSetter__(key, setter);
			}
			else if (Object.defineProperty && isGetterSetterSupported) {
				Object.defineProperty(obj, key, {
				    get : getter,
				    set : setter
				});
			}
			
			else {
				currentObj[key] != undefined && (obj[key] = currentObj[key]);
			}
		};
	}
	
	// Add extra information into newly created object.
	function addExtras( currentObj, baseObj, fn ) {
		// Return function name.
		var clss = currentObj.getClass();
		for ( var k in currentObj) {
			if (currentObj.hasOwnProperty(k) && typeof currentObj[k] == 'function' && k != fn) {
				currentObj[k] = currentObj[k].bind(currentObj);
				currentObj[k].$name = k;
				currentObj[k].$Class = clss;
			}
		}
		currentObj.getFunctionName = function( ) {
			var caller = arguments.callee.caller;
			return caller.name || caller.$name || "";
		};
		addInstance(currentObj);
		
		// eachPropertyOf(currentObj.Private, function(val, key){
		if (currentObj.Private && typeof currentObj.Private[fn] == 'function') {
			currentObj[fn] = currentObj.Private[fn];
		}
		if (currentObj[fn]) {
			currentObj[fn].$Class = currentObj.getClass();
			currentObj[fn].$name = fn;
		}
		// Check if function have constant.
		if (currentObj.Const) {
			var cnt = currentObj.Const;
			delete cnt.Static;
			for (k in cnt) {
				cnt.hasOwnProperty(k) && currentObj.$add(currentObj, k, cnt[k], true);
			}
		}
		// migrate information about abstract method to base class.
		if (currentObj.isAbstract) {
			var absMethods = currentObj.prototype.$get("Abstract");
			currentObj.setAbstractMethods = function( solidObj ) {
				for ( var k in absMethods) {
					if (absMethods.hasOwnProperty(k)) {
						if (typeof solidObj[k] != 'function') {
							throw "Abstract method " + k + " is not implemented by " + solidObj.getClass();
						}
						this[k] = solidObj[k];
					}
				}
				if (baseObj && baseObj.prototype.isAbstract) {
					baseObj.prototype.setAbstractMethods(solidObj);
				}
			};
		}
		
		if (baseObj) {
			currentObj.base = baseObj;
			!currentObj.isAbstract && baseObj.prototype.isAbstract && baseObj.prototype.setAbstractMethods(currentObj);
			baseObj.$ADD(currentObj);
		}
	}
	function createArgumentString( base, imports ) {
		var str = [];
		if (base) {
			str.push('pofn.base');
		}
		str.push('undefined');
		if (imports) {
			for ( var k in imports) {
				imports.hasOwnProperty(k) && str.push('pofn.ics.' + k);
			}
		}
		return str.join(",");
	}
	// Set relevent class information.
	function getReleventClassInfo( Class, fn, pofn ) {
		addPrototypeBeforeCall(Class, this.isAbstract);
		var tempObj, k, len;
		eval("tempObj= new Class(" + createArgumentString(pofn.base, pofn.ics) + ");");
		tempObj.setMe && tempObj.setMe(pofn);
		delete tempObj.setMe;
		this.shortHand = tempObj.shortHand;
		var info = separeteMethodsAndFields(tempObj);
		this.methods = info.methods = pofn.base ? info.methods.concat(pofn.base.prototype.$get('methods')) : info.methods;
		
		if (this.isInterface) {
			pofn.base && simpleExtend(pofn.base.prototype.$get('fields'), info.fields);
			this.fields = info.fields;
			checkMandSetF(pofn);
			deleteAddedProtoTypes(Class);
			return this;
		}
		
		var temp = this.interfaces;
		if (temp) {
			for (k = 0, len = temp.length; k < len; k++) {
				createObj(temp[k]).prototype.$checkMAndGetF(pofn, info.methods, this.isAbstract, tempObj);
			}
		}
		
		if (tempObj.init)
			tempObj.init();
		this.isAbstract && checkForAbstractFields(tempObj.Abstract, this.Class);
		this.Static = simpleExtend(tempObj.Static, {});
		this.isAbstract && (this.Abstract = simpleExtend(tempObj.Abstract, {}));
		this.staticConst = this.Static.Const;
		delete this.Static.Const;
		this.Const = simpleExtend(tempObj.Const, {});
		delete this.Const.Static;
		checkAvailability(tempObj, this.Static, this.staticConst, this.Abstract, this.Const);
		addTransient(this, tempObj);
		this.privateConstructor = !!tempObj["Private"] && tempObj["Private"][fn];
		deleteAddedProtoTypes(Class);
		temp = k = tempObj = info = Class = fn = currentScript = undefined;
		return this;
	}
	
	function getException( script, pofn ) {
		var caller = arguments.callee.caller.caller.caller;
		return (!this.$get && "Object cannot be created") || (script.isInterface && script.Class + ": can not initiated.")
		        || (pofn.prototype.$get("privateConstructor") && (caller.$Class != script.Class && caller.$Class != "jfm.io.Serialize") && "Object cannot be created")
		        || (!this.__base___ && pofn.isAbstract && script.Class + " is an abstract class");
	}
	
	function createArgumentStringObj( base, imports ) {
		var str = [];
		if (base) {
			str.push('baseObj');
		}
		str.push('undefined');
		if (imports) {
			for ( var k in imports) {
				imports.hasOwnProperty(k) && str.push('pofn.ics.' + k);
			}
		}
		return str.join(",");
	}
	
	function createClassInstance( pofn, script, fn, Class ) {
		var baseObj, ex = getException.call(this, script, pofn);
		if (ex) {
			throw ex;
		}
		baseObj = pofn.base && getBaseClassObject(pofn.base, this.__base___ ? this.get$arr() : []);
		addPrototypeBeforeCall(Class, pofn.isAbstract);
		var currentObj;
		eval("currentObj= new Class(" + createArgumentStringObj(baseObj, pofn.ics) + ");");
		currentObj.setMe && currentObj.setMe(currentObj);
		delete currentObj.setMe;
		addExtras(currentObj, baseObj, fn);
		delete currentObj["transient"];
		delete currentObj.shortHand;
		delete currentObj.init;
		deleteAddedProtoTypes(Class);
		currentObj.constructor = currentObj[fn] || defaultConstrct;
		delete currentObj[fn];
		// deleteing $add as all operations on $add are completed for this
		// instance.
		if (!this.__base___) {
			delete currentObj.$add;
		}
		
		return currentObj;
	}
	
	function getHashCode( ) {
		var hashCode = Number(Math.random().toString().replace(".", ""));
		return function( ) {
			return hashCode;
		};
	}
	
	// Run this code after all resources are available.
	function executeOnready( script, fn, Class, data ) {
		
		var internalObj = script;
		// for instance of: check if given class is a interface implemeted by
		// host class.
		var self = this;
		this.getClass = function( ) {
			return self;
		};
		this.toString = function( ) {
			return script.Class;
		};
		
		this.hashCode = getHashCode();
		script.baseClass && (this.base = fm.stringToObject(script.baseClass));
		if (this.base) {
			this.prototype.getSub = function( ) {
				return self;
			};
		}
		creareSetGet(this);
		this.ics = getAllImportClass(script.imports);
		getReleventClassInfo.call(internalObj, Class, fn, this);
		typeof internalObj.shortHand == 'string' && addShortHand(internalObj.shortHand, this);
		this.isAbstract = internalObj.isAbstract;
		//
		// Do not add script info in proto fror interface
		// script.isInterface && addFieldsInStorage.call(pofn, script, pofn,
		// true);
		this.prototype.$get = function( key ) {
			return internalObj[key];
		};
		
		createSetterGetter.call(this);
		
		Class.prototype = this;
		function isInterface( cls ) {
			var interfs = script.interfaces || [];
			for ( var k = 0, len = interfs.length; k < len; k++) {
				if (createObj(interfs[k]).instanceOf(cls)) {
					return true;
				}
			}
			return false;
		}
		this.equals = function( ) {
			return this === arguments[0];
		};
		this.instanceOf = function( cls ) {
			return cls.getClass() == this.getClass() || this.base && this.base.instanceOf(cls) || isInterface(cls);
		};
		this.constructor = defaultConstrct;
		iamready(this.getClass(), this);
		if (typeof this.main == 'function') {
			this.main(data);
			delete this.main;
		}
		data = undefined;
	}
	
	function createSetterGetterHelper( self, obj, source, isConst, isStatic ) {
		var val, cls = self.getClass();
		var isSame = obj == self;
		for ( var k in source) {
			if (source.hasOwnProperty(k)) {
				val = source[k];
				if (typeof val == 'function') {
					if (isSame) {
						val.$name = k;
						val.$Class = cls;
						obj[k] = val.bind(obj);
					}
					else {
						obj[k] == undefined && (obj[k] = self[k]);
					}
				}
				else
					obj[k] == undefined && self.prototype.$add(obj, k, source[k], isConst, isStatic);
			}
		}
	}
	
	function createSetterGetter( obj ) {
		var Static = this.prototype.$get("Static");
		obj = obj || this;
		createSetterGetterHelper(this, obj, Static, false, true);
		var StaticConst = this.prototype.$get("staticConst");
		createSetterGetterHelper(this, obj, StaticConst, true, true);
		var base = this.base;
		if (base) {
			createSetterGetter.call(base, obj);
		}
	}
	
	function classManager( script, data, older ) {
		
		var po = script.Package, fn = script.className;
		if (!po || !fn) {
			return;
		}
		if(typeof(older) == 'function' && older.name == '___manager___'){
			po[fn] = older;
			return;
		}
		if (!po[fn] && (po[fn] = window[fn])) {
			try {
				delete window[fn];
			}
			catch (e) {
				console.log(e);
			}
		}
		var Class = po[fn];
		po[fn] = function ___manager___( ) {
			var currentObj = createClassInstance.call(this, po[fn], script, fn, Class);
			if (!this.__base___) {
				currentObj.constructor.apply(currentObj, arguments);
				// Calling base constructor if not called explicitly.
				if (typeof currentObj.base == 'function') {
					currentObj.base();
				}
			}
			!this.__base___ && currentObj.el && currentObj.el[0] && (currentObj.el[0].jfm = currentObj);
			return currentObj;
		};
		// Add resource ready queue.
		addImportsOnready(script.imports, function( ) {
			executeOnready.call(po[fn], script, fn, Class, data);
			data = undefined;
		}, fn);
	}
})(window);

fm.basedir = "/javascript";fm.isConcatinated = true; 

fm.Package("jfm.component");
fm.Class("Component");
jfm.component.Component = function (me){this.setMe=function(_me){me=_me;};

    
    this.shortHand = "Component";
    
    this.Component = function(){
        this.el = jQuery.apply(this, arguments);
    };

    function addAt(me, index, obj){
        obj = typeof obj =='string' ? obj : Component.isComponent(obj)? obj.el : jQuery(obj);
        var child;
        me.el.children().each(
        function( indx, o){
            if( index == indx){
                child = jQuery(o);
                return false;
            }
        });
        if(!child){
            addAtEnd(me, obj);
        }
        else{
            child.before(obj);
            obj instanceof jQuery && obj[0].jfm &&  obj[0].jfm.afterRender && obj[0].jfm.afterRender(me.el);
        }
    }
    
    function addAtEnd(me, obj){
        var o = typeof obj =='string' ? obj : Component.isComponent(obj)? obj.el : jQuery(obj);       
        me.el.append( o );
        o instanceof jQuery && o[0].jfm &&  o[0].jfm.afterRender && o[0].jfm.afterRender(me.el);
    }
    
    function createElem (obj){
        
        if(typeof obj =='string' || obj instanceof jQuery){
            return obj;
        }
        else if( obj.el instanceof jQuery){
            return obj.el;
        }
        else if(jQuery.isArray(obj)){
            return obj;
        }
        else{
            var items = obj.items,
            newItems = [],
            Class,
            defaultProp = obj.defaultProp,
            cls = defaultProp.Class;
            delete defaultProp.Class; 
            for(var k = 0; k < items.length; k++){
                Class = items[k].Class || cls;
                delete items[k].Class;
                newItems.push(new Class(jQuery.extend( {}, defaultProp, items[k])));
            }
        }
        return newItems;
    }
    
    this.add = function(index, obj){
        this.testing = 67;
        if(jQuery.isNumeric(index)){
            obj = createElem(obj);
            if(jQuery.isArray(obj)){
                for(var k = 0; k< obj.length; k++){
                    addAt(this, index, obj[k] );
                }
            }
            else{
                addAt(this, index, obj );
            }
        }
        else{
            obj = createElem(index);
            if(jQuery.isArray(obj)){
                for(var k = 0; k < obj.length; k++){
                    addAtEnd(this, obj[k]);
                }
            }
            else{
                addAtEnd(this, obj);
            }
        }
    };     
    
    this.method = function(){
        var arr = [];
        for(var k =1; k < arguments.length; k++){
            arr.push(arguments[k]);
        }
        return this.el[arguments[0]].apply(this.el, arr);
    };
    
    Static.isComponent = function(obj){
        return typeof obj.instanceOf == 'function' &&  obj.el instanceof jQuery;
    };
    
    Static.getCSSClass = function(c, cls){
        return (c? c : "" ) + " "+ cls;
    };
    
    this.toString = function() {
        return this.el;
    };
};


/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
fm.Package("jfm.html");
fm.Class("Container", 'jfm.component.Component');
jfm.html.Container = function (base, me, Component){this.setMe=function(_me){me=_me;};
    
    this.shortHand = "Container";
    this.Container = function(config){
        var draggable = config && config.draggable;
        if(config){
            delete config.draggable;
        }
        if(config instanceof jQuery ){
        	base(config);
        }else{
        	base( '<div />', jQuery.extend(true, {}, config) );
        }
        if(draggable){
            this.el.draggable({
                revert: true
              
            });
        }
    };

};


fm.Package("com.reader.snippet");
fm.Class("Snippet", "jfm.html.Container");
com.reader.snippet.Snippet = function (base, me, Container) {
	
	this.init = function( ) {
		Static.height = 110;
		Static.margins = 18;
		Static.widthAmlifier = 5;
	};
	
	this.setMe = function( _me ) {
		me = _me;
	};
	
	this.getBody = function( ) {
		var html = "<div class='brief-body'>" + "<p>" + this.contentSnippet + "</p>" + "</div>";
		return html;
	};
	
	this.getTitle = function( ) {
		var html = "<div class='brief-title'>" + "<h2 class='title'>" + this.title + "</h2>" + "</div>";
		return html;
	};
	
	this.getImage = function( ) {
		var html = "<div class='brief-image'>";
		if (this.mediaGroups) {
			html += "<img src='" + this.mediaGroups[0].contents[0].url + "' />";
		}
		html += "</div>";
		return html;
	};
	
	this.show = function( ) {
		com.reader.Reader.openArticle(me);
	};
	
	this.activate = function(){
		this.el.addClass("selected");
		scrollIntoView(this.el.get(0));
	};
	
	this.deActivate = function(){
		this.el.removeClass("selected");
	};
	
	function scrollIntoView(element) {
		var parent = jQuery("#article-list");
		var containerLeft = parent.parent().scrollLeft();
		var containerRight = containerLeft + parent.parent().width();
		var elemLeft = element.offsetLeft;
		var elemRight = elemLeft + $(element).width();
		if (elemLeft < containerLeft) {
			parent.parent().scrollLeft(elemLeft);
		}
		else if (elemRight > containerRight) {
			parent.parent().scrollLeft(elemRight - parent.parent().width() + me.margins);
		}
	}
	
	this.next = function() {
		if(!this.el.next().length){
    		return false;
    	}
    	return this.el.next()[0].jfm;
    };
    
    this.prev = function() {
    	if(!this.el.prev().length){
    		return false;
    	}
    	return this.el.prev()[0].jfm;
    };
    
    this.isSelected = function() {
		return this.el.hasClass('selected');
	};
    
	this.Snippet = function( nb, width, index ) {
		$.extend(true, this, nb);
		base({
		    "class" : 'newsSnippet',
		    height: this.height,
		    indx : String(index),
		    html : this.getTitle() + this.getImage() + this.getBody(),
		    width : width,
			click: me.show
		});
	};
};
fm.Package("jfm.cookie");
fm.Class("Cookie");
jfm.cookie.Cookie = function (me){this.setMe=function(_me){me=_me;};
	
	Static.set = function(name, value, days) {
		var expires = "";
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			expires = "; expires="+date.toGMTString();
		}
		document.cookie = name+"="+value+expires+"; path=/";
    };
	
	Static.get = function(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
    };
	
	Static.erase = function(name) {
	    this.set(name);
    };
};fm.Package("com.reader.snippet");
fm.Import("com.reader.snippet.Snippet");
fm.Class("SnippetGroup", "jfm.html.Container");

com.reader.snippet.SnippetGroup = function (base, me, Snippet, Container) {

	var entries, f_size, counterPerColumn, currentSnippet;

	this.setMe = function(_me) {
		me = _me;
	};
	function getWidth(fs){
		var w = jQuery(window).width() - Snippet.margins, cw = fs*fs;
		if( w < cw ){
			return w;
		}
		return cw;
	}
	this.SnippetGroup = function(resp, height, f_s) {
		entries = resp.entries, f_size = f_s;
		var len = resp.entries.length ;
		counterPerColumn = Math.floor((height) / (Snippet.height + Snippet.margins)) ;
		var columns = Math.ceil(len / counterPerColumn);
		base({
			'class' : 'item-item-cont',
			html : "<h2>" + resp.title + "</h2>",
			css : {
				width : ( getWidth(f_size) +  + Snippet.margins) * columns,
				height : "100%"
			}
		});
	};

	this.addSnippets = function() {

		var k = -1, len = entries.length , firstSnipptes;
		var h = Math.ceil(len / counterPerColumn);
		function recursive() {
			if (k == len - 1) {
				return;
			}
			k++;
			var bf = new Snippet(entries[k], getWidth(f_size), k % h);
			if (!firstSnipptes) {
				firstSnipptes = bf;
			}
			if (k % h == 0) {
				$("<div class='vertical-news-container'></div>").appendTo(me.el).append(bf.el);
			}
			else {
				me.el.find(".vertical-news-container:last").append(bf.el);
			}
			setTimeout(recursive, 10);
			return bf;
		}
		recursive();
		currentSnippet = this.el.find(".newsSnippet:first")[0].jfm;
	};

	this.next = function() {

		currentSnippet.deActivate();
		if (!currentSnippet.next()) {
			return false;
		}
		currentSnippet = currentSnippet.next();
		currentSnippet.activate();
		return true;
	};

	this.prev = function() {

		currentSnippet.deActivate();
		if (!currentSnippet.prev()) {
			return false;
		}
		currentSnippet = currentSnippet.prev();
		currentSnippet.activate();
		return true;
	};

	this.up = function() {

		currentSnippet.deActivate();
		if (!currentSnippet.el.parent().prev().length) {
			return false;
		}
		var dom =  currentSnippet.el.parent().prev().find("[indx='" + currentSnippet.el.attr('indx') + "']")[0];
		if(!dom){
			return false;
		}
		currentSnippet = dom && dom.jfm;
		currentSnippet.activate();
		return true;
	};

	this.down = function() {

		currentSnippet.deActivate();
		if (!currentSnippet.el.parent().next().length) {
			return false;
		}
		var dom =  currentSnippet.el.parent().next().find("[indx='" + currentSnippet.el.attr('indx') + "']")[0];
		if(!dom){
			return false;
		}
		currentSnippet = dom && dom.jfm;
		currentSnippet.activate();
		return true;
	};

	this.removeHighLight = function() {
		currentSnippet.deActivate();
	};

	this.showArticle = function() {
		currentSnippet.show();
	};
};fm.Package("com.reader.snippet");
fm.Import("com.reader.snippet.Snippet");
fm.Import("jfm.cookie.Cookie");
fm.Import("com.reader.snippet.SnippetGroup");
fm.Class("AllSnippets", "jfm.html.Container");
com.reader.snippet.AllSnippets = function (base, me, Snippet, Cookie, SnippetGroup, Container) {
	this.setMe = function( _me ) {
		me = _me;
	};
	var resources;
	var active;
	var totalWidth = 0;
	var singleton, currentGroup;
	
	Static.getInstance = function( ) {
		if (!singleton) {
			singleton = new me();
		}
		return singleton;
	};
	
	this.resize = function(w, h){
		if(!active){
			return;
		}
		var clean = true;
		var len =resources.length;
		for(var k =0; k < len; k++){
			this.create(resources[k], clean, true);
			clean = false;
		}
	};
	
	Private.AllSnippets = function( ) {
		var c = com.reader.Reader.getDivision().center;
		base({
			id : "article-list",
			height : "100%"
		});
		resources = [];
		c.add(this);
		Cookie.get("Sfontsize") && this.el.css('font-size', Cookie.get("Sfontsize")+"px");
		active = false;
		c.resize(this.resize);
	};
	
	this.clearStoredData = function( fontChange) {
		this.el.empty();
		currentGroup = null;
		totalWidth = 0;
		!fontChange && (resources = []);
	};
	
	this.active = function( ) {
		active = true;
		this.el.show().siblings().hide();
		com.reader.Reader.getDivision().left.show();
	};
	
	this.isActive = function( ) {
		return active;
	};
	
	this.deActive = function( ) {
		active = false;
		com.reader.Reader.getDivision().left.hide();
		this.el.hide();
	};
	
	this.create = function( resp, clean, fontChange ) {
		if(!active){
			return;
		}
		if (clean) {
			this.clearStoredData(fontChange);
		}
		!fontChange && resources.push(resp);
		var f_size = parseInt(this.el.css("font-size"));
		var snippetGroup = new SnippetGroup(resp, this.el.height(), f_size + Snippet.widthAmlifier);
		if(!currentGroup){
			currentGroup = snippetGroup;
		}
		this.add(snippetGroup);
		snippetGroup.addSnippets(resp.entries);
		totalWidth += snippetGroup.el.width() + 40;
		this.el.width(totalWidth);
	};
	this.next = function( ) {
		if (!active) {
			return;
		}
		if(!currentGroup.next() && currentGroup.el.next().length){
			currentGroup = currentGroup.el.next()[0].jfm;
			currentGroup.next();
		}
	};
	
	this.prev = function( ) {
		if (!active) {
			return;
		}
		if(!currentGroup.prev() && currentGroup.el.prev().length){
			currentGroup = currentGroup.el.prev()[0].jfm;
			currentGroup.prev();
		}	
	};
	
	this.up = function( ) {
		if (!active) {
			return;
		}
		currentGroup.up();
	};
	
	this.down = function( ) {
		if (!active) {
			return;
		}
		currentGroup.down();
	};
	
	this.removeHighLight = function( ) {
		if (!active) {
			return;
		}
		currentGroup.removeHighLight();
	};
	this.showArticle = function( ) {
		if (active) {
			currentGroup.showArticle();
		}
	};
	
	this.changeFont = function(change) {
		if(!active){
			return;
		}
		var f_size = parseInt(this.el.css("font-size")) + change;
		Cookie.set('Sfontsize', f_size);
		me.el.css("font-size", f_size);
		var clean = true;
		var len =resources.length;
		for(var k =0; k < len; k++){
			this.create(resources[k], clean, true);
			clean = false;
		}
    };
};
fm.Package("com.reader.filler");
fm.Class("FillContent");

com.reader.filler.FillContent = function (me) {
	this.setMe = function( _me ) {
		me = _me;
	};
	$.fn.SkipRoot = function( ) {
		this.find("*").filter(function( ) {
			return this.tagName.toLowerCase() != 'br' && $.trim($(this).text()) == '';
		}).remove();
	};
	$.fn.htmlTruncate = function( strt, max, settings ) {
		settings = jQuery.extend({
			chars : /\s|\."|\./
		}, settings);
		var myRegEx = /<\/?[^<>]*\/?>/gim;
		var $this = this;
		var myStrOrig = $this.html();
		var myStr = myStrOrig;
		var myRegExArray;
		var myRegExHash = {};
		while ((myRegExArray = myRegEx.exec(myStr)) != null) {
			if (myRegExHash[(myRegExArray.index - strt) < (myRegExHash[0] == undefined ? 0 : (myRegExHash[0].length)) ? 0 : (myRegExArray.index - strt)] != undefined)
				myRegExHash[0] += myRegExArray[0];
			else
				myRegExHash[(myRegExArray.index - strt) < 0 ? 0 : (myRegExArray.index - strt)] = myRegExArray[0];
		}
		myStr = jQuery.trim(myStr.split(myRegEx).join(""));
		var totalLen = myStr.length;
		if (strt != 0) {
			myStr = myStr.substring(strt, myStr.length);// strt is removing text
														// only thats why we
														// need tags
		}
		
		if (myStr.length > max) {
			var c;
			while (max > 0) {
				c = myStr.charAt(max);
				if (c.match(settings.chars)) {
					myStr = myStr.substring(0, max + 1);
					break;
				}
				max--;
			}
		}
		else {
			max = totalLen;
		}
		var start = 0;
		if (strt != 0 && myRegExHash[0]) {
			start = myRegExHash[0].length;
		}
		var end = 0;
		if (myStrOrig.search(myRegEx) != -1) {
			for ( var eachEl in myRegExHash) {
				if (end == 0 && eachEl >= myStr.length) {
					end = myStr.length;
				}
				myStr = [ myStr.substring(0, eachEl), myRegExHash[eachEl], myStr.substring(eachEl, myStr.length) ].join("");
			}
		}
		if (end == 0) {
			end = myStr.length;
		}
		myStr = myStr.substring(0, start).replace(/<br\s*\/?>/mgi, "") + myStr.substring(start, end) + myStr.substring(end, myStr.length).replace(/<br\s*\/?>/mgi, "");
		$(this).html(myStr);
		return [ max + 1, totalLen ];
	};
	function charsPerLine( dom ) {
		
		var target_width = dom.width(); // line width
		var text = 'I want to know how many chars of this text fit.';
		var span = document.createElement('span');
		dom.html(span);
		span.style.whiteSpace = 'nowrap';
		var fit = text.length;
		span.innerHTML = text;
		var chars = Math.floor(target_width / span.offsetWidth * fit);
		return chars - 3;
	}
	this.truncateWithHeight = function( dom, from, origHtml ) {
		var t2 = Date.now();
		var cpl = charsPerLine(dom);
		var lineHeight = parseInt(dom.css("line-height"));
		var ownHeight = dom.height();
		var nols = Math.floor(ownHeight / lineHeight);
		var totalChars = cpl * nols;
		dom.html(origHtml);
		var step = 3;
		var lastCharOffset = dom.htmlTruncate(from, totalChars);
		var all = dom.find("*");
		var decrease = 0, firstP = true;
		var relativeHeight = dom.get(0).offsetTop + ownHeight;
		for ( var i = 0; i < all.length; i++) {
			if (relativeHeight < all[i].offsetTop) {
				jQuery(all[i]).remove();
			}
			else if(all[i].nodeName != 'BR' && jQuery(all[i]).text() == ""){
				 jQuery(all[i]).remove();
			}
			else if(firstP && all[i].nodeName == "P" ){
				$(all[i]).css("margin-top","0px");
				firstP = false;
			}
		}
		var totalLen = lastCharOffset[1];
		var count = 0;
		var diff = dom.get(0).scrollHeight - ownHeight;
		decrease = Math.floor((diff / lineHeight) * cpl / 1.7);
		if (decrease <= 0) {
			decrease = 0;
		}
		while (diff >= lineHeight / 5 || count == 0) {
			lastCharOffset = dom.htmlTruncate(0, lastCharOffset[0] - decrease);
			if (lastCharOffset[0] <= 0) {
				lastCharOffset[0] = 0;
				break;
			}
			if (count > 20) {
				break;
			}
			count++;
			diff = dom.get(0).scrollHeight - ownHeight;
			decrease = Math.floor((diff / lineHeight -1 ) * cpl / 1.7);
			if (decrease <= 0) {
				decrease = step;
			}
		}
		dom.html(dom.html().replace(/<\/a>/mgi, "</a> "));
 	//	console.log(count);
		return [ from + lastCharOffset[0], totalLen - from - lastCharOffset[0] ];
	};
	this.FillContent = function( ) {

	};
};
fm.Package("com.reader.article");
fm.Class("ImageContainer", "jfm.html.Container");
com.reader.article.ImageContainer = function (base, me, Container){this.setMe=function(_me){me=_me;};
	var f_size, contentColumns, columnInsideImageWidth, imageContainerWidth;
	this.ImageContainer = function(images, f_s, multi, margins, height, width){
		if (images.length == 0 || $.trim(images[0].text) == "") {
			imageContainerWidth = 0;
			return 0;
		}
		imageContainerWidth = width > 500 ? 500 : width;
		f_size = f_s;
		var columnWidth = f_size * multi + margins;
		contentColumns = imageContainerWidth / columnWidth;
		if (contentColumns - 1 > .7) {
			contentColumns = 2;
		}
		else {
			contentColumns = 1;
		}
		columnInsideImageWidth = Math.floor(imageContainerWidth / contentColumns - margins / 2 - 2);
		base({
		    width : imageContainerWidth,
		    height : height - 10,
		    'class' : "imageContainer selector parent"
		});		
		this.add(addImage(images[0]) );
	};
	
	function addImage(img) {
		return new Container({
			  width : "100%",
			    height:255,
			    "class" : "image-container",
			    html : "<img  src='" + img.href + "'/><div class='imagetext'>" + img.text + "</div>"
		});
	}
	
	this.getWidth = function() {
		return imageContainerWidth? imageContainerWidth + 20 : 0;
    };
	
	this.getColumns = function() {
		return contentColumns;
	};
	
	this.getSingleColumnWidth = function() {
		return columnInsideImageWidth;
	};
};fm.Package("com.reader.article");
fm.Import("com.reader.filler.FillContent");
fm.Import("jfm.cookie.Cookie");
fm.Import("com.reader.article.ImageContainer");
fm.Class("ArticleManager", "jfm.html.Container");
com.reader.article.ArticleManager = function (base, me, FillContent, Cookie, ImageContainer, Container) {
	this.setMe = function( _me ) {
		me = _me;
	};
	var setTimeOut, multi, currentSelected, active, singleton;
	var margins;
	var self = this;
	var columnsInfo, currentCoNumber;
	this.title;
	this.content;
	this.imageHeight;
	this.imageContainerWidth;
	Static.getInstance = function( ) {
		
		if (!singleton) {
			singleton = new me();
		}
		return singleton;
	};
	this.resize = function( w, h ) {
		if(!active){
			return;
		}
		this.create(parseInt(this.el.css("font-size")), true);
	};
	Private.ArticleManager = function( ) {
		var c = com.reader.Reader.getDivision().center;
		base({
		    id : "article-container",
		    height : "100%"
		});
		columnsInfo = jQuery("#columnsInfo");
		c.add(this);
		Cookie.get("Afontsize") && this.el.css('font-size', Cookie.get("Afontsize") + "px");
		setTimeOut = -9;
		multi = 18;
		active = false;
		margins = 20;
		currentCoNumber = 1;
		this.imageHeight = 400;
		c.resize(this.resize);
	};
	this.next = function( ) {
		if (!active) {
			return;
		}
		
		if (currentSelected.next().length != 0) {
			currentSelected.removeClass("column-selected");
			currentSelected = currentSelected.next().addClass("column-selected");
			scrollIntoView(currentSelected.get(0));
		}
		else {
			this.el.parent().scrollLeft(this.el.width());
			return;
		}
		currentCoNumber++;
		jQuery(".current",columnsInfo).html(currentCoNumber);
	};
	function scrollIntoView( element ) {
		var containerLeft = me.el.parent().scrollLeft();
		var containerRight = containerLeft + me.el.parent().width();
		var elemLeft = element.offsetLeft;
		var elemRight = elemLeft + $(element).width();
		if (elemLeft < containerLeft) {
			me.el.parent().scrollLeft(elemLeft);
		}
		else if (elemRight > containerRight) {
			me.el.parent().scrollLeft(elemRight - me.el.parent().width() + margins - 10);
		}
	}
	
	this.prev = function( ) {
		if (!active) {
			return;
		}
		
		if (currentSelected.prev(".selector").length != 0) {
			currentSelected.removeClass("column-selected");
			currentSelected = currentSelected.prev().addClass("column-selected");
			scrollIntoView(currentSelected.get(0));
		}
		else {
			this.el.parent().scrollLeft(0);
			return;
		}
		currentCoNumber--;
		jQuery(".current",columnsInfo).html(currentCoNumber);
	};
	
	function changed( obj ) {
		for ( var i = 0; i < changeCbArray.length; i++) {
			changeCbArray[i](obj);
		}
	}
	;
	
	var changeCbArray = [];
	this.registerChange = function( cb ) {
		changeCbArray.push(cb);
	};
	this.removeHighLight = function( ) {
		if (!active) {
			return;
		}
		currentSelected.removeClass("column-selected");
	};
	
	function createHeader( title ) {
		return {
			height:0,
			width:0
		};
		var div = $("<div />", {
		    'class' : 'title',
		    html : "<h2>" + title + "</h2>"
		}).appendTo(me.el);
		return {
		    height : div.height(),
		    width : div.width()
		};
	}
	
	this.active = function( ) {
		active = true;
		columnsInfo.show();
		this.el.show();
	};
	
	this.deActive = function( ) {
		active = false;
		columnsInfo.hide();
		this.el.hide();
	};
	
	this.isActive = function( ) {
		return active;
	};
	
	function prepareHtml( ) {
		if (!self.imgInfo) {
			self.imgInfo = [];
			var imgsInfo = $("#hidden >.content").find("img").parents("div:first").not(".content").clone();
			var imgi = {};
			for ( var i = 0; i < imgsInfo.length; i++) {
				imgi = {};
				imgi.href = $("img", imgsInfo[i]).attr("src");
				imgi.height = $("img", imgsInfo[i]).height();
				imgi.text = $(imgsInfo[i]).text();
				self.imgInfo.push(imgi);
			}
		}
		$("#hidden").find("*").filter(function( ) {
			return this.tagName.toLowerCase() != 'br' && this.tagName.toLowerCase() != 'img' && $.trim($(this).text()) == '';
		}).remove();
		self.imgages = $("#hidden >.content").find("*").width('').height('').find("img");
		self.content = $.trim($("#hidden >.content").html().replace(/[\s\s]+/, " ").replace(/\n+/, " ").replace(/>\s+/, ">")).replace(/\r\n/gim, "").replace(/^\s/gim, "");
		self.htmlLength = self.content.length;
		$("#hidden >.content").find("img").parent().not(".content").remove();
		$("#hidden >.content").find(">br, script").remove();
		self.title = $("#hidden >.title").text();
	}
	function getWidth(fs){
		var w = jQuery(window).width() - margins, cw = fs*multi;
		if( w < cw ){
			return w;
		}
		return cw;
	}
	this.create = function( f_size, isTaskbar ) {
		if(!active){
			return;
		}
		if (!isTaskbar) {
			self.imgInfo = undefined;
		}
		var articalWidth = getWidth( f_size);
		var articleContainer = this.el.empty();
		var trancatedLength = [ 0, 1 ];
		var htm = "<div class='parent selector'><div class='s'></div></div>";
		if (setTimeOut) {
			clearTimeout(setTimeOut);
		}
		currentCoNumber = 1;
		prepareHtml();
		jQuery(".current",columnsInfo).html(currentCoNumber);
		var bodyHeight = this.el.height();
		var content = new FillContent(this.content);
		var header = createHeader(this.title);
		var imageContainer = new ImageContainer(self.imgInfo, f_size, multi, margins, bodyHeight - header.height - margins, articalWidth);
		var columns = imageContainer.getColumns() || 0;
		columns && this.add(imageContainer);
		var i = 0;
		function recursive( ) {
			var removeHeight = margins + header.height;
			if (trancatedLength[1] <= 0) {
				return;
			}
			i++;
			jQuery(".total",columnsInfo).html(i);
			var elem;
			//alert("a");
			articleContainer.width((i - columns) * (articalWidth + margins) + imageContainer.getWidth());
			if (i <= columns) {
				removeHeight += imageContainer.el.find(".image-container").height() + margins;
				elem = $(htm).appendTo(imageContainer.el).removeClass("parent").addClass("text-inside-image");
				elem.find("div.s").height(bodyHeight - removeHeight).width(imageContainer.getSingleColumnWidth());
			}
			else {
				elem = $(htm).appendTo(articleContainer);
				elem.find("div.s").height(bodyHeight - removeHeight -10).width(articalWidth);
			}
			
			trancatedLength = content.truncateWithHeight(elem.find("div.s"), trancatedLength[0], self.content);
			setTimeOut = setTimeout(recursive, 10);
			//alert( i + "");
		}
		recursive();
		//alert("a");

		currentSelected = $("#article-container").find("div.selector:first");
		changed();
	};
	this.getSelectedColumn = function( ) {
		return currentSelected.clone(true);
	};
	this.getSelectedFontSize = function( ) {
		return currentSelected.css('font-size');
	};
	
	this.changeFont = function( change ) {
		if (!active) {
			return;
		}
		var f_size = parseInt(this.el.css("font-size")) + change;
		Cookie.set('Afontsize', f_size);
		me.el.empty().css("font-size", f_size);
		this.create(f_size, true);
	};
};
fm.Package("com.reader.settings");
fm.Class("Settings", "jfm.html.Container");
com.reader.settings.Settings = function (base, me, Container) {
	this.setMe = function( _me ) {
		me = _me;
	};
	var data, singleton, callback;
	
	Static.getInstance = function( cb ) {
		if (!singleton) {
			singleton = new me(cb);
		}
		return singleton;
	};
	
	function submit( ) {
		var arr = $(this).serializeArray();
		for ( var k in arr) {
			callback(arr[k].value);
		}
		return false;
	}
	
	this.disable = function( ) {
		
		this.el.hide();
	};
	this.enable = function( ) {
		
		this.el.show();
	};
	this.getData = function(){
		return data;
	};
	this.Settings = function( ) {
		base({
		    id : 'settings',
		    html : "<div><form method='POST' id='settingsForm'> </form></div>"
		});
		this.el.find("form").submit(submit);
		data = [ {
		    url : "http://feeds.mashable.com/Mashable",
		    name : "Mashable"
		}, {
		    url : "http://feeds.feedburner.com/fakingnews",
		    name : "Faking News",
		}, {
		    url : "http://blogs.forbes.com/ewanspence/feed/",
		    name : "Ewan Spence"
		},{
			url: "http://www.engadget.com/editor/brian-heater/rss.xml",
			name: "Engadget"
		},{
			url: "http://feeds.feedburner.com/liveside",
			name: "liveside"
		},{
			url: "http://feeds.slashgear.com/slashgear",
			name : "Slashgear"
		},{
			url: "http://feeds.feedburner.com/TechCrunch/",
			selected : true,
			name : "Tech Crunch"
		}
		];
	};
	this.changeSettings = function( cb ) {
		callback = cb;
		var html = "";
		for ( var k = 0; k < data.length; k++) {
			html += "<div class='items'><label><input name='" + data[k].name + "' value=' " + data[k].url + "' type='checkbox'/>&nbsp;&nbsp;&nbsp;&nbsp;" + data[k].name + "</label></div>";
		}
		html +="<div class='items'><input type='text' value='' placeholder='url' /> <button class='addUrl'>Add</button></div>";
		html += "<div class='items'><input type='submit' value='Save' /> </div>";
		this.el.find("form").html(html);
		this.el.find("form .addUrl").click(function(){
			var url = jQuery(this).prev().val();
			saveUrl (url, cb);
		});
	};
	function saveUrl(url) {
		data.push({url:url,selected:true, name:"added"});
		me.changeSettings(callback);
    }
	this.getSelectedUrl = function( cb ) {
		for ( var k = 0; k < data.length; k++) {
			if (data[k].selected) {
				cb(data[k].url);
			}
		}
		return "";
	};
};
fm.Package("com.reader.taskbar");
fm.Import("com.reader.snippet.AllSnippets");
fm.Import("com.reader.article.ArticleManager");
fm.Import("com.reader.settings.Settings");
fm.Class("Taskbar", "jfm.html.Container");
com.reader.taskbar.Taskbar = function (base, me, AllSnippets, ArticleManager, Settings, Container) {
	this.setMe = function(_me) {
		me = _me;
	};
	var callback, singleton;

	Static.getInstance = function(cb) {
		if (!singleton) {
			singleton = new me(cb);
		}
		return singleton;
	};

	Private.Taskbar = function(cb) {
		callback = cb;
		base({
			id : "taskbar",
			height : 40,
			html : jQuery("#taskbar-template").html()
		});
		com.reader.Reader.getDivision().center.add(Settings.getInstance());
		Settings.getInstance().disable();
		com.reader.Reader.getDivision().bottom.add(this);
		$(".controlers .plus", this.el).click(increaseFontSize);
		$(".controlers .minus", this.el).click(decreaseFontSize);
		$(".home a", this.el).click(me.clickHome);
		$(">.news-feed-select a", this.el).click(changeSettings);
		Settings.getInstance().getSelectedUrl(function(url) {
			getData(url);
		});
	};
	function increaseFontSize(e) {
		e.preventDefault();
		ArticleManager.getInstance().changeFont(+2);
		AllSnippets.getInstance().changeFont(+2);
		return false;
	}
	function decreaseFontSize(e) {
		// alert("a");
		e.preventDefault();
		ArticleManager.getInstance().changeFont(-2);
		AllSnippets.getInstance().changeFont(-2);
		return false;
	}

	function changeSettings(e) {

		ArticleManager.getInstance().deActive();
		AllSnippets.getInstance().deActive();
		Settings.getInstance().enable();
		Settings.getInstance().changeSettings(function(url) {
			Settings.getInstance().disable();
			AllSnippets.getInstance().active();
			getData(url);
		});
		return false;
	}

	function getData(url) {
		AllSnippets.getInstance().clearStoredData();
		com.reader.Reader.parseRSS(url, callback, true);
	}

	this.clickHome = function(e) {
		e.preventDefault();
		if (!AllSnippets.getInstance().isActive()) {
			ArticleManager.getInstance().deActive();
			AllSnippets.getInstance().active();
		}
		return false;
	};
};
fm.Package("com.reader.snippet");
fm.Import("com.reader.settings.Settings");
fm.Import("com.reader.snippet.AllSnippets");
fm.Class("LeftBar", "jfm.html.Container");
com.reader.snippet.LeftBar = function (base, me, Settings, AllSnippets, Container){this.setMe=function(_me){me=_me;};
	var singleton;
	Static.getInstance = function(){
		if(!singleton){
			singleton = new me();
		}
		return singleton;
	};
	this.active = function( ) {
		this.el.show();
	};
	
	this.isActive = function( ) {
		return active;
	};
	
	this.deActive = function( ) {
		this.el.hide();
	};
	
	this.create = function(callback){
		var data = Settings.getInstance().getData();
		var html = "<div>";
		for ( var k = 0; k < data.length; k++) {
			html += "<div class='items'><a href='" + data[k].url+ "'> " + data[k].name+ " </a> </div>";
		}
		html +="</div>";
		this.el.html(html);
		this.el.click(function(e) {
			e.preventDefault();
			if(e.target.nodeName == "A"){
				AllSnippets.getInstance().clearStoredData();
				com.reader.Reader.parseRSS(e.target.href, callback, true);
			}
			return false;
        });
	};
	
	this.Private.LeftBar = function() {
		base({
			width:150,
			height: "100%"
		});
    };
}; 
fm.Package("jfm.division");
fm.Class("Part","jfm.component.Component");
jfm.division.Part = function (base, me, Component){this.setMe=function(_me){me=_me;};

    var set, division, resizeCB;    
    this.Part = function(config, divsn, s){
        set = s;
        resizeCB = [];
        division = divsn;
        config.css = config.css || {};
        config.css.display = 'none';
        base('<div />',config);
    };
    
    this.add = function(elem){        
        set(elem);
        elem;
    };
    
    this.hide = function() {
    	this.el.hide();
    	division.updateLayout();
    };
    
    this.show = function() {
        this.el.show();
        division.updateLayout();
    };
    this.reset = function(){
        this.el.empty();
        this.el.css({ 'display':'none',height:0, width:0 });
        division.updateLayout();
        return this;
    };
    
    this.resize = function(fn) {
    	if(typeof fn == 'function'){
    		resizeCB.push(fn);
    	}else{
    		var w= this.el.width(); h = this.el.height();
    		for(var k = 0; k < resizeCB.length; k++){
    			resizeCB[k](w, h);
    		}
    	}
    };
};

fm.Package("jfm.division");
fm.Import("jfm.division.Part");
fm.Class("Division", "jfm.html.Container");
jfm.division.Division = function (base, me, Part, Container){this.setMe=function(_me){me=_me;};

	var width, height, me;
	this.addTo = function( container ) {
		var timeoutID;
		container = Component.isComponent(container) ? container.el : jQuery(container);
		me.ownerCt = container;
		container[0].resize = function( w, h ) {
			timeoutID && clearTimeout(timeoutID)
			;
			timeoutID = setTimeout(function( ) {
				width = w;
				height = h;
				me.updateLayout();
				timeoutID = 0;
			}, 300);
		};
		this.el.appendTo(container);
		width = container.width();
		height = container.height();
		this.updateLayout();
	};
	
	this.init = function( ) {
		Static.config = {
		    width : "100%",
		    height : "100%",
		    'class' : 'jfm-division'
		};
	};
	
	this.Division = function( config ) {
		me = this;
		var container = config && config.addTo;
		if (config) {
			delete config.addTo;
		}
		config = jQuery.extend({}, this.config, config);
		height = width = 0;
		base(config);
		this.top = new Part({
			'class' : "jfm-division-top"
		}, this, function( elem ) {
			set(elem, me.top, 0, 0);
		});
		this.left = new Part({
			'class' : "jfm-division-left"
		}, this, function( elem ) {
			set(elem, me.left, 0, getRemainingHeight());
		});
		this.center = new Part({
			'class' : "jfm-division-center"
		}, this, function( elem ) {
			set(elem, me.center, getRemainingWidth(), getRemainingHeight());
		});
		me.center.el.css("overflow", 'hidden');
		this.center.el.show();
		this.right = new Part({
			'class' : "jfm-division-right"
		}, this, function( elem ) {
			set(elem, me.right, 0, getRemainingHeight());
		});
		this.bottom = new Part({
			'class' : "jfm-division-bottom"
		}, this, function( elem ) {
			set(elem, me.bottom, 0, 0);
		});
		this.add([ this.top, this.left, this.center, this.right, this.bottom ]);
		if (container) {
			this.addTo(container);
		}
	};
	
	function getRemainingWidth( ) {
		var w = (me.left && me.left.el[0].offsetWidth) || 0;
		w += (me.right && me.right.el[0].offsetWidth) || 0;
		return width - w;
	}
	
	function getRemainingHeight( ) {
		var h = (me.bottom && me.bottom.el.height()) || 0;
		h += (me.top && me.top.el.height()) || 0;
		return height - h;
	}
	
	this.updateLayout = function( ) {
		var h = getRemainingHeight();
		var w = getRemainingWidth();
		me.top && me.top.el.width(width);
		me.bottom && me.bottom.el.width(width);
		me.left && me.left.el.height(h);
		me.right && me.right.el.height(h);
		var m = me.center && me.center.el.height(h).width(w) && me.center.resize;
		m && m(w, h);
	};
	
	function set( obj, appender, difW, difH ) {
		if (obj && obj.instanceOf && obj.el instanceof jQuery) {
			// TODO
		}
		else {
			obj = new Container(obj);
		}
		difH && appender.el.height(difH);
		appender.el.show();
		if (difH > appender.el.height()) {
			difW = difW - 20;
		}
		difW && appender.el.width(difW);
		obj.el.appendTo(appender.el);
		!difW && appender.el.width(obj.el.width());
		!difH && appender.el.height(obj.el.height());
		me.updateLayout();
		return obj;
	}
};


fm.Package("com.reader.events");
fm.Import("com.reader.snippet.AllSnippets");
fm.Import("com.reader.article.ArticleManager");
fm.Import("com.reader.taskbar.Taskbar");
fm.Class("Events");
com.reader.events.Events = function (me, AllSnippets, ArticleManager, Taskbar) {
	this.setMe = function( _me ) {
		me = _me;
	};
	var singleton;
	
	Static.getInstance = function( ) {
		if (!singleton) {
			singleton = new me();
		}
		return singleton;
	};
	
	Private.Events = function( ) {
		this.keyupEvents();
		this.keydownEvents();
	};
	
	this.keyupEvents = function( ) {
		$(document).keyup(function( e ) {
			switch (e.keyCode) {
				case 13: {
					AllSnippets.getInstance().showArticle();
					return false;
				}
				case 36: {
					Taskbar.getInstance().clickHome(e);
					return false;
				}
				case 8: {
					if (!AllSnippets.getInstance().isActive()) {
						Taskbar.getInstance().clickHome(e);
						return false;
					}
					return false;
				}
			}
		});
	};
	
	this.keydownEvents = function( ) {
		var t = [], scrolling = false, scrollv = 0;
		jQuery("#next").click(function( ) {
			scrolling = true;
			AllSnippets.getInstance().next();
			ArticleManager.getInstance().next();
			preventScroll();
			return false;
		});
		jQuery("#prev").click(function( ) {
			scrolling = true;
			AllSnippets.getInstance().prev();
			ArticleManager.getInstance().prev();
			preventScroll();
			return false;
		});
		
		function preventScroll( ) {
			setTimeout(function( ) {
				scrolling = false;
			}, 400);
		}
		if (navigator.userAgent.indexOf("Phone") != -1 && navigator.userAgent.indexOf("IE") != -1) {
			com.reader.Reader.getDivision().center.el.css("overflow", "auto");
			com.reader.Reader.getDivision().center.el.scroll(function( e ) {
				e.preventDefault();
				if (scrolling) {
					return false;
				}
				scrolling = true;
				t.push(setTimeout(function( ) {
					if (t.length > 1) {
						t.pop();
						return;
					}
					t = [];
					if (e.target.scrollLeft - scrollv > 10) {
						AllSnippets.getInstance().next();
						ArticleManager.getInstance().next();
					}
					else if (e.target.scrollLeft - scrollv < -10) {
						AllSnippets.getInstance().prev();
						ArticleManager.getInstance().prev();
					}
					scrollv = e.target.scrollLeft;
					preventScroll();
				}, 100));
				return false;
			});
		}
		$(document).keydown(function( e ) {
			switch (e.keyCode) {
				
				case 39: {
					AllSnippets.getInstance().next();
					ArticleManager.getInstance().next();
					return false;
				}
				case 37: {
					AllSnippets.getInstance().prev();
					ArticleManager.getInstance().prev();
					return false;
				}
				case 38: {
					AllSnippets.getInstance().up();
					ArticleManager.getInstance().removeHighLight();
					return false;
				}
				case 40: {
					AllSnippets.getInstance().down();
					ArticleManager.getInstance().removeHighLight();
					return false;
				}
				case 8: {
					if (!AllSnippets.getInstance().isActive()) {
						Taskbar.getInstance().clickHome(e);
						return false;
					}
					return false;
				}
				default: {
					AllSnippets.getInstance().removeHighLight();
					ArticleManager.getInstance().removeHighLight();
				}
					
			}
		});
	};
};
fm.Package("com.reader");
fm.Import("com.reader.snippet.AllSnippets");
fm.Import("com.reader.article.ArticleManager");
fm.Import("com.reader.taskbar.Taskbar");
fm.Import("com.reader.snippet.LeftBar");
fm.Import("jfm.division.Division");
fm.Import('com.reader.events.Events');
fm.Class("Reader");
com.reader.Reader = function (me, AllSnippets, ArticleManager, Taskbar, LeftBar, Division, Events) {
	var division;
	this.setMe = function( _me ) {
		me = _me;
	};
	Static.getDivision = function( ) {
		return division;
	};
	
	Static.openArticle = function( obj ) {
		var f_size = parseInt($("#article-container").css("font-size"));
		$("#hidden").html("<div class='title'>" + obj.title + "</div>" + "<div class='content'>" + obj.content + "</div>");
		AllSnippets.getInstance().deActive();
		ArticleManager.getInstance().active();
		ArticleManager.getInstance().create(f_size);
	};
	
	function callback( resp, clean ) {
		ArticleManager.getInstance().deActive();
		AllSnippets.getInstance().active();
		AllSnippets.getInstance().create(resp, clean);
	}
	
	function updateLayout( ) {
		$(window).ready(function( ) {
			var win = jQuery(window);
			win.resize(function( ) {
				var w = win.width(), h = win.height();
				var m = $('body').width(w).height(h)[0].resize;
				m && m(w, h);
			});
			$('body').trigger('resize');
		});
	}
	
	Static.main = function( ) {
		updateLayout();
		division = new Division({
			id : "main"
		});
		division.addTo(jQuery("body"));
		Taskbar.getInstance(callback);
		if(jQuery(window).width()>700){
		division.left.add(LeftBar.getInstance());
		LeftBar.getInstance().create(callback);
		}
		Events.getInstance();
		$("a").live('click', function( ) {
			window.open(this.href, '_blank');
			return false;
		});
		return false;
	};
	
	Static.parseRSS = function( url, callback, isGoogle ) {
		url = isGoogle ? document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=8&callback=?&q=' + encodeURIComponent(url) : url;
		$.ajax({
		    url : url,
		    dataType : 'json',
		    success : function( data ) {
			    callback(data.responseData.feed);
		    }
		});
	};
};fm.isConcatinated = false;
