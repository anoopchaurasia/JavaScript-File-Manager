/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Created by JetBrains WebStorm. User: Anoop Date: 5/7/11 Time: 11:14 PM To
 * change this template use File | Settings | File Templates.
 */

t = new Date().getTime();
(function( window, undefined ) {
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
			
			function setter( val ) {
				if (isConst) {
					throw this + "." + key + " can not be changed.";
				}
				valueStorage[key] = val;
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
				classRefernece[key] = classRefernece[key] || [];
				classRefernece[key].push(obj);
				
				classProto[key] != undefined && (obj[key] = classProto[key]);
			}
		};
	}
	
	// intializing fm
	if (!global.fm) {
		global.fm = {};
	}
	// Assuming JavaScript base directory is "javascript".
	
	global.fm.basedir = "/javascript";
	
	// /global.fm.import adds new javascript file to head of document. JAVA:
	// import
	global.fm['import'] = global.fm.Import = function Import( path ) {
		path = path.replace(/\s/g, "");
		add(path);
		this.Include(path); // function
		return this;
	};
	
	// Keep track of loaded files in storePath.
	var storePath = [];
	
	// /same as global.fm.import but for non jfm files.
	global.fm['include'] = global.fm.Include = function Include( path ) {
		
		if (!storePath[global.fm.basedir + path]) {
			storePath[global.fm.basedir + path] = true;
		}
		else {
			return this;
		}
		if (this.isConcatinated && path.indexOf("http") != 0) {
			return this;
		}
		path = path.replace(/\s/g, "");
		if (path.indexOf("http") != 0 && path.lastIndexOf(".js") != path.length - 3) {
			path = global.fm.basedir + "/" + path.split(".").join("/") + ".js";
		}
		include(path);
		return this;
	};
	
	// /onReadyState method get called when browser fail to load a javascript
	// file.
	function onReadyState( ) {
		console.error("Unable to load file: " + this.src + ". Please check the file name and parh.");
		return false;
	}
	
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
		return true;
	}
	
	// Create script tag inside head.
	function include( path ) {
		scriptArr.push({
			packageName : ""
		});
		require(path);
		classManager(scriptArr.pop());
		// if(!docHead){
		// docHead = document.getElementsByTagName("head")[0];
		// }
		// // isNonfm && global.fm.holdReady(true);
		// var e = document.createElement("script");
		// //onerror is not supported by IE so this will throw exception only
		// for non IE browsers.
		// e.onerror = onReadyState;
		// e.src = path;
		// e.type = "text/javascript";
		// docHead.appendChild(e);
		//          
	}
	var scriptArr = [];
	// This should be first method to be called from jfm classes.JAVA:package
	global.fm["package"] = global.fm.Package = function Package( packageName ) {
		scriptArr.pop();
		var script = {
			packageName : packageName || ""
		};
		scriptArr.push(script);
		return this;
	};
	
	// / this method Add base class for current Class.JAVA:extend
	global.fm['super'] = global.fm['base'] = global.fm.Base = function Base( baseClass ) {
		var script = scriptArr[scriptArr.length - 1];
		script && (script.baseClass = baseClass) && this.Import(baseClass);
		return this;
	};
	
	// Set current script as Interface; JAVA:interface
	global.fm["interface"] = global.fm.Interface = function Interface( ) {
		var script = scriptArr[scriptArr.length - 1];
		script.isInterface = true;
		this.Class.apply(this, arguments);
		
	};
	
	global.fm['abstractClass'] = global.fm.AbstractClass = function( ) {
		var script = scriptArr[scriptArr.length - 1];
		script.isAbstract = true;
		this.Class.apply(this, arguments);
	};
	// Add all implemented interface to class interface list. and import
	// them.JAVA:implements
	global.fm['implements'] = global.fm.Implements = function Implements( ) {
		
		var script = scriptArr[scriptArr.length - 1];
		script.interfaces = script.interfaces || [];
		for ( var k = 0, len = arguments.length; k < len; k++) {
			this.Import(arguments[k]);
			script.interfaces.push(arguments[k]);
		}
	};
	
	// global.fm.Class creates a jfm class.
	global.fm['class'] = global.fm.Class = function Class( ) {
		
		var script = scriptArr[scriptArr.length - 1];
		var a = arguments, o = null;
		script.className = a[0];
		if (a[1]) {
			this.Base(a[1]);
		}
		o = createObj("" + script.packageName);
		script.Class = "" + (script.packageName == "" ? "" : script.packageName + ".") + script.className;
		
		script.Package = o;
	};
	
	// global.fm.stringToObject: map a string into object.
	global.fm.stringToObject = function stringToObject( classStr ) {
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
		var d = str.split("."), j, o = global;
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
			newImports[splited[splited.length - 1]] = global.fm.stringToObject(imp[k]);
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
		eachPropertyOf(internalObj.Static, function( v, k ) {
			temp[k] = true;
		});
		eachPropertyOf(internalObj.staticConst, function( v, k ) {
			temp[k] = true;
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
			
			eachPropertyOf(pofn.prototype.$get('fields'), function( v, k ) {
				pofn.prototype.$add(pofnS, k, v, true, true);
			});
		};
	}
	window.me = window.base = undefined;
	
	var gContext = [];
	
	function createContext( context ) {
		var ics = context.ics;
		context.prototype.added = {};
		deleteAdded((gContext[gContext.length - 1] || {
			prototype : {}
		}).prototype.added);
		me = context;
		base = context.base;
		gContext.push(context);
		for ( var k in ics) {
			if (ics.hasOwnProperty(k) && !window[k]) {
				context.prototype.added[k] = true;
				window[k] = ics[k];
			}
		}
		return true;
	}
	function deleteAdded( added ) {
		try {
			for ( var k in added) {
				if (added.hasOwnProperty(k)) {
					delete window[k];
				}
			}
		}
		catch (e) {
			console.log(e);
		}
	}
	
	function deleteContext( ) {
		var pop = gContext.pop();
		deleteAdded(pop.prototype.added);
		me = gContext[gContext.length - 1];
		if (me) {
			base = me.base;
			var added = me.prototype.added;
			for ( var k in added) {
				if (added.hasOwnProperty(k) && !window[k]) {
					window[k] = me.ics[k];
				}
			}
		}
		else {
			base = undefined;
		}
	}
	
	// Change the context of function.
	function changeContext( fun, context, bc ) {
		return function( ) {
			var added = me != context && createContext(context);
			var temp = fun.apply(context, arguments);
			bc && (temp = bc());
			added && deleteContext();
			return temp;
		};
	}
	
	function defaultConstrct( ) {
		if (arguments.length > 0) {
			global.fm.stackTrace("Class does not have any constructor ");
		}
	}
	
	function addShortHand( str, protoClass ) {
		var indx = str.lastIndexOf(".");
		var o = createObj(str.substring(0, indx));
		var name = str.substring(1 + indx);
		if (o[name]) {
			console.error("Short hand " + str + " for " + protoClass + " has conflict with. " + o[name]);
		}
		o[name] = protoClass;
	}
	
	// Wait for resource to be ready
	
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
		var clss = currentObj.getClass();
		for ( var k in currentObj) {
			if (currentObj.hasOwnProperty(k) && typeof currentObj[k] == 'function' && k != fn) {
				currentObj[k] = changeContext(currentObj[k], currentObj);
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
			if (baseObj.prototype.isAbstract) {
				baseObj.prototype.getSub = function( ) {
					return currentObj.isAbstract ? currentObj.getSub() : currentObj;
				};
			}
			currentObj.base = baseObj;
			!currentObj.isAbstract && baseObj.prototype.isAbstract && baseObj.prototype.setAbstractMethods(currentObj);
			baseObj.$ADD(currentObj);
		}
	}
	
	// Set relevent class information.
	function getReleventClassInfo( Class, fn, pofn ) {
		
		addPrototypeBeforeCall(Class, this.isAbstract);
		
		var tempObj = new Class(pofn.ics, pofn.base), k, len;
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
	
	function createClassInstance( pofn, script, fn, Class ) {
		var baseObj, ex = getException.call(this, script, pofn);
		if (ex) {
			throw ex;
		}
		
		baseObj = pofn.base && getBaseClassObject(pofn.base, this.__base___ ? this.get$arr() : []);
		addPrototypeBeforeCall(Class, pofn.isAbstract);
		var added = createContext(pofn);
		var currentObj = new Class(pofn.ics, baseObj);
		//
		added && deleteContext();
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
	function executeOnready( script, fn, Class ) {
		
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
		
		script.baseClass && (this.base = global.fm.stringToObject(script.baseClass));
		
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
		if (typeof this.main == 'function') {
			this.main = changeContext(this.main, this);
			this.main();
			delete this.main;
		}
		return;
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
						obj[k] = changeContext(val, obj);
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
	
	function classManager( script ) {
		
		var po = script.Package, fn = script.className;
		if (!po || !fn) {
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
		po[fn] = function manager( ) {
			var currentObj = createClassInstance.call(this, po[fn], script, fn, Class);
			var added = createContext(currentObj);
			if (!this.__base___) {
				currentObj.constructor.apply(currentObj, arguments);
				// Calling base constructor if not called explicitly.
				if (typeof currentObj.base == 'function') {
					currentObj.base();
				}
			}
			!this.__base___ && currentObj.el && currentObj.el[0] && (currentObj.el[0].jfm = currentObj);
			added && deleteContext();
			return currentObj;
		};
		executeOnready.call(po[fn], script, fn, Class);
	}
})(global);