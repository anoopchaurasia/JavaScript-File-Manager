(function (window, undefined) {
  function doesDefinePropertyWork(e) {
try {
  return Object.defineProperty(e, "a", {}), "a" in e
} catch(t) {
  return !1
}
  }

  function creareSetGet(e) {
var t = {};
e.prototype.$add = function (e, n, r, i) {
  function s(e) {
if(i) throw this + "." + n + " can not be changed.";
t[n] = e
  }

  function o() {
return t[n]
  }
  r != undefined && (t[n] = r), e.__defineGetter__ ? (e.__defineGetter__(n, o), e.__defineSetter__(n, s)) : Object.defineProperty && isGetterSetterSupported ? Object.defineProperty(e, n, {
get: o,
set: s
  }) : e[n] == undefined && (e[n] = t[n])
}
  }

  function onReadyState() {
return console.error("Unable to load file: " + this.src + ". Please check the file name and parh."), !1
  }

  function add(e) {
!currentScript && fm.Package();
var t = currentScript;
t && !t.imports && (t.imports = []);
for(var n = 0, r = t.imports.length; n < r; n++) if(t.imports[n] == e) return this;
return t.imports.push(e), !0
  }

  function include(e) {
docHead || (docHead = document.getElementsByTagName("head")[0]);
var t = document.createElement("script");
fm.version && (e += "?v=" + fm.version), t.onerror = onReadyState, t.src = e, t.type = "text/javascript", docHead.appendChild(t)
  }

  function callAfterDelay(e, t, n) {
setTimeout(function () {
  classManager(e, t, n)
})
  }

  function createObj(e) {
if(!e || e.length == 0) return window;
var t = e.split("."),
  n, r = window;
for(n = 0; n < t.length; n += 1) r[t[n]] = r[t[n]] || {}, r = r[t[n]];
return r
  }

  function iamready(e, t) {
if(classDependent[e]) for(var n = 0, r = classDependent[e].length; n < r; n++) classDependent[e][n](e, t);
classDependent[e] = {
  classObj: t
}
  }

  function onFileReady(e, t) {
classDependent[e] = classDependent[e] || [], classDependent[e].push(t)
  }

  function isReady(e) {
return classDependent[e]
  }

  function getAllImportClass(e) {
var t = {}, n;
for(var r = 0; e && r < e.length; r++) n = e[r].split("."), t[n[n.length - 1]] = fm.stringToObject(e[r]);
return t
  }

  function addPrototypeBeforeCall(e, t) {
saveState.push(window.Static, window.Abstract, window.Const, window.Private), Static = e.prototype.Static = {}, Abstract = e.prototype.Abstract = t ? {} : undefined, Const = e.prototype.Const = {}, Const.Static = Static.Const = {}, Private = e.prototype.Private = {}
  }

  function deleteAddedProtoTypes(e) {
delete e.prototype.Static, delete e.prototype.Const, delete e.prototype.Private, delete e.prototype.Abstract, Private = saveState.pop(), Const = saveState.pop(), Abstract = saveState.pop(), Static = saveState.pop()
  }

  function isNotAEmptyObject(e) {
for(var t in e) if(e.hasOwnProperty(t)) return !0;
return !1
  }

  function simpleExtend(e, t) {
for(var n in e) t[n] == undefined && (t[n] = e[n]);
return t
  }

  function checkAvailability(e) {
for(var t = 1, n = arguments.length; t < n; t++) for(var r in arguments[t]) if(e.hasOwnProperty(r)) throw e.getClass() + ": has " + r + " at more than one places"
  }

  function separeteMethodsAndFields(e) {
var t = [],
  n = {};
return eachPropertyOf(e, function (e, r) {
  typeof e == "function" ? t.push(r + "") : n[r + ""] = e
}), e = undefined, {
  methods: t,
  fields: n
}
  }

  function addTransient(e, t) {
var n = {}, r, i = t["transient"] || [];
i.push("shortHand");
for(r = 0; r < i.length; r++) n[i[r]] = !0;
eachPropertyOf(e.Static, function (e, t) {
  n[t] = !0
}), eachPropertyOf(e.staticConst, function (e, t) {
  n[t] = !0
}), e["transient"] = n, e = t = r = n = undefined
  }

  function checkForAbstractFields(e, t) {
eachPropertyOf(e, function (e, n) {
  if(typeof e != "function") throw t + ": can not contain abstract fields."
})
  }

  function checkMandSetF(e) {
e.prototype.$checkMAndGetF = function (t, n, r, i) {
  var s = {}, o, u, a = e.prototype.$get("methods");
  if(r) {
var f = i.Abstract;
for(o = 0, u = a.length; o < u; o++) f[a[o]] || (f[a[o]] = function () {})
  } else {
for(o = 0, u = n.length; o < u; o++) s[n[o]] = !0;
for(o = 0, u = a.length; o < u; o++) if(!s[a[o]]) throw "Interface method " + a[o] + " of " + e.getClass() + " not implemented by " + t.getClass()
  }
  eachPropertyOf(e.prototype.$get("fields"), function (n, r) {
e.prototype.$add(t, r, n, !0, !0)
  })
}
  }

  function changeContext(e, t, n) {
return function () {
  e.apply(t, arguments), n()
}
  }

  function defaultConstrct() {
arguments.length > 0 && fm.stackTrace("Class does not have any constructor ")
  }

  function addShortHand(e, t) {
var n = e.lastIndexOf("."),
  r = createObj(e.substring(0, n)),
  i = e.substring(1 + n);
r[i] && console.error("Short hand " + e + " for " + t + " has conflict with. " + r[i]), r[i] = t
  }

  function addImportsOnready(e, t, n) {
function s() {
  r--, r == 0 && i && t()
}
var r = 0,
  i;
for(var o = 0; e && o < e.length; o++) {
  r++;
  var u = isReady(e[o]);
  u && "classObj" in u ? s() : onFileReady(e[o], function (e, t) {
s()
  })
}
i = !0, r == 0 && t()
  }

  function getBaseClassObject(e, t) {
function n() {
  var e, n = t,
i = r.prototype,
s = i.$get("Const"),
o;
  for(var u in r) if(r.hasOwnProperty(u)) {
o = s.hasOwnProperty(u), e = r[u];
if(typeof e == "function") {
  if(u == "$add") continue;
  for(var a = n.length - 1; a >= 0; a--) {
if(n[a][u] != undefined) break;
n[a][u] = e
  }
} else {
  o && r.$add(r, u, e, o);
  for(var f = n.length - 1; f >= 0; f--) {
if(n[f][u] != undefined) break;
r.$add(n[f], u, undefined, o)
  }
}
  }
  delete r.$add;
  var l = n.pop();
  return l.base = r
}
e.prototype.get$arr = function () {
  return t
}, e.prototype.__base___ = !0;
var r = new e;
delete e.prototype.__base___, delete e.prototype.get$arr;
var i = changeContext(r.constructor, r, n);
return i.prototype = r, i.$ADD = function (e) {
  t.unshift(e), delete i.$ADD
}, i
  }

  function eachPropertyOf(e, t) {
if(typeof e != "null") for(var n in e) e.hasOwnProperty(n) && t(e[n], n)
  }

  function addInstance(e) {
var t = {};
e.$add = function (n, r, i, s) {
  function o(n) {
if(s) throw this + "." + r + " can not be changed.";
s ? t[r] = n : e[r] = n
  }

  function u() {
return s ? t[r] : e[r]
  }
  i != undefined && (t[r] = i), n.__defineGetter__ ? (n.__defineGetter__(r, u), n.__defineSetter__(r, o)) : Object.defineProperty && isGetterSetterSupported ? Object.defineProperty(n, r, {
get: u,
set: o
  }) : e[r] != undefined && (n[r] = e[r])
}
  }

  function addExtras(e, t, n) {
var r = e.getClass();
for(var i in e) e.hasOwnProperty(i) && typeof e[i] == "function" && i != n && (e[i] = e[i].bind(e), e[i].$name = i, e[i].$Class = r);
e.getFunctionName = function () {
  var e = arguments.callee.caller;
  return e.name || e.$name || ""
}, addInstance(e), e.Private && typeof e.Private[n] == "function" && (e[n] = e.Private[n]), e[n] && (e[n].$Class = e.getClass(), e[n].$name = n);
if(e.Const) {
  var s = e.Const;
  delete s.Static;
  for(i in s) s.hasOwnProperty(i) && e.$add(e, i, s[i], !0)
}
if(e.isAbstract) {
  var o = e.prototype.$get("Abstract");
  e.setAbstractMethods = function (e) {
for(var n in o) if(o.hasOwnProperty(n)) {
  if(typeof e[n] != "function") throw "Abstract method " + n + " is not implemented by " + e.getClass();
  this[n] = e[n]
}
t && t.prototype.isAbstract && t.prototype.setAbstractMethods(e)
  }
}
t && (e.base = t, !e.isAbstract && t.prototype.isAbstract && t.prototype.setAbstractMethods(e), t.$ADD(e))
  }

  function createArgumentString(e, t) {
var n = [];
e && n.push("pofn.base"), n.push("undefined");
if(t) for(var r in t) t.hasOwnProperty(r) && n.push("pofn.ics." + r);
return n.join(",")
  }

  function getReleventClassInfo(Class, fn, pofn) {
addPrototypeBeforeCall(Class, this.isAbstract);
var tempObj, k, len;
eval("tempObj= new Class(" + createArgumentString(pofn.base, pofn.ics) + ");"), tempObj.setMe && tempObj.setMe(pofn), delete tempObj.setMe, this.shortHand = tempObj.shortHand;
var info = separeteMethodsAndFields(tempObj);
this.methods = info.methods = pofn.base ? info.methods.concat(pofn.base.prototype.$get("methods")) : info.methods;
if(this.isInterface) return pofn.base && simpleExtend(pofn.base.prototype.$get("fields"), info.fields), this.fields = info.fields, checkMandSetF(pofn), deleteAddedProtoTypes(Class), this;
var temp = this.interfaces;
if(temp) for(k = 0, len = temp.length; k < len; k++) createObj(temp[k]).prototype.$checkMAndGetF(pofn, info.methods, this.isAbstract, tempObj);
return tempObj.init && tempObj.init(), this.isAbstract && checkForAbstractFields(tempObj.Abstract, this.Class), this.Static = simpleExtend(tempObj.Static, {}), this.isAbstract && (this.Abstract = simpleExtend(tempObj.Abstract, {})), this.staticConst = this.Static.Const, delete this.Static.Const, this.Const = simpleExtend(tempObj.Const, {}), delete this.Const.Static, checkAvailability(tempObj, this.Static, this.staticConst, this.Abstract, this.Const), addTransient(this, tempObj), this.privateConstructor = !! tempObj.Private && tempObj.Private[fn], deleteAddedProtoTypes(Class), temp = k = tempObj = info = Class = fn = currentScript = undefined, this
  }

  function getException(e, t) {
var n = arguments.callee.caller.caller.caller;
return !this.$get && "Object cannot be created" || e.isInterface && e.Class + ": can not initiated." || t.prototype.$get("privateConstructor") && n.$Class != e.Class && n.$Class != "jfm.io.Serialize" && "Object cannot be created" || !this.__base___ && t.isAbstract && e.Class + " is an abstract class"
  }

  function createArgumentStringObj(e, t) {
var n = [];
e && n.push("baseObj"), n.push("undefined");
if(t) for(var r in t) t.hasOwnProperty(r) && n.push("pofn.ics." + r);
return n.join(",")
  }

  function createClassInstance(pofn, script, fn, Class) {
var baseObj, ex = getException.call(this, script, pofn);
if(ex) throw ex;
baseObj = pofn.base && getBaseClassObject(pofn.base, this.__base___ ? this.get$arr() : []), addPrototypeBeforeCall(Class, pofn.isAbstract);
var currentObj;
return eval("currentObj= new Class(" + createArgumentStringObj(baseObj, pofn.ics) + ");"), currentObj.setMe && currentObj.setMe(currentObj), delete currentObj.setMe, addExtras(currentObj, baseObj, fn), delete currentObj["transient"], delete currentObj.shortHand, delete currentObj.init, deleteAddedProtoTypes(Class), currentObj.constructor = currentObj[fn] || defaultConstrct, delete currentObj[fn], this.__base___ || delete currentObj.$add, currentObj
  }

  function getHashCode() {
var e = Number(Math.random().toString().replace(".", ""));
return function () {
  return e
}
  }

  function executeOnready(e, t, n, r) {
function o(t) {
  var n = e.interfaces || [];
  for(var r = 0, i = n.length; r < i; r++) if(createObj(n[r]).instanceOf(t)) return !0;
  return !1
}
var i = e,
  s = this;
this.getClass = function () {
  return s
}, this.toString = function () {
  return e.Class
}, this.hashCode = getHashCode(), e.baseClass && (this.base = fm.stringToObject(e.baseClass)), this.base && (this.prototype.getSub = function () {
  return s
}), creareSetGet(this), this.ics = getAllImportClass(e.imports), getReleventClassInfo.call(i, n, t, this), typeof i.shortHand == "string" && addShortHand(i.shortHand, this), this.isAbstract = i.isAbstract, this.prototype.$get = function (e) {
  return i[e]
}, createSetterGetter.call(this), n.prototype = this, this.equals = function () {
  return this === arguments[0]
}, this.instanceOf = function (e) {
  return e.getClass() == this.getClass() || this.base && this.base.instanceOf(e) || o(e)
}, this.constructor = defaultConstrct, iamready(this.getClass(), this), typeof this.main == "function" && (this.main(r), delete this.main), r = undefined
  }

  function createSetterGetterHelper(e, t, n, r, i) {
var s, o = e.getClass(),
  u = t == e;
for(var a in n) n.hasOwnProperty(a) && (s = n[a], typeof s == "function" ? u ? (s.$name = a, s.$Class = o, t[a] = s.bind(t)) : t[a] == undefined && (t[a] = e[a]) : t[a] == undefined && e.prototype.$add(t, a, n[a], r, i))
  }

  function createSetterGetter(e) {
var t = this.prototype.$get("Static");
e = e || this, createSetterGetterHelper(this, e, t, !1, !0);
var n = this.prototype.$get("staticConst");
createSetterGetterHelper(this, e, n, !0, !0);
var r = this.base;
r && createSetterGetter.call(r, e)
  }

  function classManager(e, t, n) {
var r = e.Package,
  i = e.className;
if(!r || !i) return;
if(typeof n == "function" && n.name == "___manager___") {
  r[i] = n;
  return
}
if(!r[i] && (r[i] = window[i])) try {
  delete window[i]
} catch(s) {
  console.log(s)
}
var o = r[i];
r[i] = function () {
  var n = createClassInstance.call(this, r[i], e, i, o);
  return this.__base___ || (n.constructor.apply(n, arguments), typeof n.base == "function" && n.base()), !this.__base___ && n.el && n.el[0] && (n.el[0].jfm = n), n
}, addImportsOnready(e.imports, function () {
  executeOnready.call(r[i], e, i, o, t), t = undefined
}, i)
  }
  if(window.fm && window.fm["package"]) return;
  Function.prototype.bind || (Function.bind = Function.prototype.bind = function (e) {
var t = this;
return function () {
  return t.apply(e, arguments)
}
  });
  var isGetterSetterSupported = doesDefinePropertyWork({}) || Object.prototype.__defineGetter__;
  window.fm || (window.fm = {});
  var currentScript;
  fm.basedir = "/javascript", fm.stackTrace = function (e) {
try {
  e && console.error(e);
  var t = arguments.callee,
n = "";
  while(t.caller) t.caller.getName ? n += t.caller.getName() + " of " + t.caller.$Class + "\n" : t.caller.name != "" && (n += t.caller.name + "\n"), t = t.caller;
  console.log(n);
  var r = ty
} catch(i) {
  console.error(i.stack && i.stack.substring(i.stack.indexOf("\n")))
}
  }, fm["import"] = fm.Import = function (t) {
return t = t.replace(/\s/g, ""), add(t), this.Include(t), this
  };
  var storePath = [];
  fm.include = fm.Include = function () {
var t = [];
for(var n = 1; n < arguments.length; n++) t.push(arguments[n]);
var r = arguments[0],
  i = fm.basedir.replace(/\//gim, "");
return storePath[i + r] ? this : (storePath[i + r] = t || !0, fm.isConcatinated && r.indexOf("http") != 0 ? this : (r = r.replace(/\s/g, ""), r.indexOf("http") != 0 && r.lastIndexOf(".js") != r.length - 3 && (r = fm.basedir + "/" + r.split(".").join("/") + ".js"), include(r), this))
  };
  var docHead;
  fm["package"] = fm.Package = function (t) {
return currentScript = {
  packageName: t || ""
}, this
  }, fm["super"] = fm.base = fm.Base = function (t) {
return currentScript && (currentScript.baseClass = t) && this.Import(t), this
  }, fm["interface"] = fm.Interface = function () {
!currentScript && this.Package(), currentScript.isInterface = !0, this.Class.apply(this, arguments)
  }, fm.abstractClass = fm.AbstractClass = function () {
!currentScript && this.Package(), currentScript.isAbstract = !0, this.Class.apply(this, arguments)
  }, fm["implements"] = fm.Implements = function () {
!currentScript && this.Package();
var t = currentScript;
t.interfaces = t.interfaces || [];
for(var n = 0, r = arguments.length; n < r; n++) this.Import(arguments[n]), t.interfaces.push(arguments[n])
  }, fm.isExist = function (e) {
var t = e.split("."),
  n = window;
for(var r in t) {
  if(!n[t[r]]) return !1;
  n = n[t[r]]
}
return typeof n == "function" && n.name == "___manager___" ? !0 : !1
  }, fm["class"] = fm.Class = function () {
!currentScript && this.Package();
var t = currentScript,
  n, r = arguments,
  i = null;
t.className = r[0], r[1] && this.Base(r[1]), i = createObj("" + t.packageName), t.Class = "" + (t.packageName == "" ? "" : t.packageName + ".") + t.className, t.Package = i;
var s = fm.basedir.replace(/\//gim, "");
typeof storePath[s + t.Class] == "object" && (n = storePath[s + t.Class], storePath[s + t.Class] = !0), callAfterDelay(t, n, i[t.className]), currentScript = undefined
  }, fm.stringToObject = function (t) {
var n = window,
  r = t.split(".");
for(var i = 0; n && i < r.length; i++) n = n[r[i]];
return n
  };
  var classDependent = {}, saveState = [];
  window.getFunctionName = function () {
return arguments.callee.caller.name
  }
})(window), fm.basedir = "/javascript", fm.isConcatinated = !0, fm.version = 1352908241900,

function (e, t, n) {
  "$:nomunge";

  function f(e) {
return e = e || location.href, "#" + e.replace(/^[^#]*#?(.*)$/, "$1")
  }
  var r = "hashchange",
i = document,
s, o = e.event.special,
u = i.documentMode,
a = "on" + r in t && (u === n || u > 7);
  e.fn[r] = function (e) {
return e ? this.bind(r, e) : this.trigger(r)
  }, e.fn[r].delay = 50, o[r] = e.extend(o[r], {
setup: function () {
  if(a) return !1;
  e(s.start)
},
teardown: function () {
  if(a) return !1;
  e(s.stop)
}
  }), s = function () {
function p() {
  var n = f(),
i = h(u);
  n !== u ? (c(u = n, i), e(t).trigger(r)) : i !== u && (location.href = location.href.replace(/#.*/, "") + i), o = setTimeout(p, e.fn[r].delay)
}
var s = {}, o, u = f(),
  l = function (e) {
return e
  }, c = l,
  h = l;
return s.start = function () {
  o || p()
}, s.stop = function () {
  o && clearTimeout(o), o = n
}, e.browser.msie && !a && function () {
  var t, n;
  s.start = function () {
t || (n = e.fn[r].src, n = n && n + f(), t = e('<iframe tabindex="-1" title="empty"/>').hide().one("load", function () {
  n || c(f()), p()
}).attr("src", n || "javascript:0").insertAfter("body")[0].contentWindow, i.onpropertychange = function () {
  try {
event.propertyName === "title" && (t.document.title = i.title)
  } catch(e) {}
})
  }, s.stop = l, h = function () {
return f(t.location.href)
  }, c = function (n, s) {
var o = t.document,
  u = e.fn[r].domain;
n !== s && (o.title = i.title, o.open(), u && o.write('<script>document.domain="' + u + '"</script>'), o.close(), t.location.hash = n)
  }
}(), s
  }()
}(jQuery, this), fm.Package("jfm.component"), fm.Class("Component"), jfm.component.Component = function (e) {
  function t(e, t, r) {
r = typeof r == "string" ? r : Component.isComponent(r) ? r.el : jQuery(r);
var i;
e.el.children().each(function (e, n) {
  if(t == e) return i = jQuery(n), !1
}), i ? (i.before(r), r instanceof jQuery && r[0].jfm && r[0].jfm.afterRender && r[0].jfm.afterRender(e.el)) : n(e, r)
  }

  function n(e, t) {
var n = typeof t == "string" ? t : Component.isComponent(t) ? t.el : jQuery(t);
e.el.append(n), n instanceof jQuery && n[0].jfm && n[0].jfm.afterRender && n[0].jfm.afterRender(e.el)
  }

  function r(e) {
if(typeof e == "string" || e instanceof jQuery) return e;
if(e.el instanceof jQuery) return e.el;
if(jQuery.isArray(e)) return e;
var t = e.items,
  n = [],
  r, i = e.defaultProp,
  s = i.Class;
delete i.Class;
for(var o = 0; o < t.length; o++) r = t[o].Class || s, delete t[o].Class, n.push(new r(jQuery.extend({}, i, t[o])));
return n
  }
  this.setMe = function (t) {
e = t
  }, this.shortHand = "Component", this.Component = function () {
this.el = jQuery.apply(this, arguments)
  }, this.add = function (e, i) {
this.testing = 67;
if(jQuery.isNumeric(e)) {
  i = r(i);
  if(jQuery.isArray(i)) for(var s = 0; s < i.length; s++) t(this, e, i[s]);
  else t(this, e, i)
} else {
  i = r(e);
  if(jQuery.isArray(i)) for(var s = 0; s < i.length; s++) n(this, i[s]);
  else n(this, i)
}
  }, this.method = function () {
var e = [];
for(var t = 1; t < arguments.length; t++) e.push(arguments[t]);
return this.el[arguments[0]].apply(this.el, e)
  }, Static.isComponent = function (e) {
return typeof e.instanceOf == "function" && e.el instanceof jQuery
  }, Static.getCSSClass = function (e, t) {
return(e ? e : "") + " " + t
  }, this.toString = function () {
return this.el
  }
}, fm.Package("jfm.html"), fm.Class("Container", "jfm.component.Component"), jfm.html.Container = function (e, t, n) {
  this.setMe = function (e) {
t = e
  }, this.shortHand = "Container", this.Container = function (t) {
var n = t && t.draggable;
t && delete t.draggable, t instanceof jQuery ? e(t) : e("<div />", jQuery.extend(!0, {}, t)), n && this.el.draggable({
  revert: !0
})
  }
}, fm.Package("jfm.division"), fm.Class("Part", "jfm.component.Component"), jfm.division.Part = function (e, t, n) {
  this.setMe = function (e) {
t = e
  };
  var r, i, s, o;
  this.Part = function (t, n, u) {
r = u, s = [], i = n, t.css = t.css || {}, t.css.display = "none", e("<div />", t), o = !0
  }, this.add = function (e) {
r(e), e
  }, this.hide = function () {
if(!o) return;
o = !1, this.el.hide(), i.updateLayout()
  }, this.show = function () {
if(o) return;
o = !0, this.el.show(), i.updateLayout()
  }, this.reset = function () {
return this.el.empty(), this.el.css({
  display: "none",
  height: 0,
  width: 0
}), i.updateLayout(), this
  }, this.resize = function (e) {
if(typeof e == "function") s.push(e);
else {
  var t = this.el.width();
  h = this.el.height();
  for(var n = 0; n < s.length; n++) s[n](t, h)
}
  }
}, fm.Package("jfm.division"), fm.Import("jfm.division.Part"), fm.Class("Division", "jfm.html.Container"), jfm.division.Division = function (e, t, n, r) {
  function o() {
var e = t.left && t.left.el[0].offsetWidth || 0;
return e += t.right && t.right.el[0].offsetWidth || 0, i - e
  }

  function u() {
var e = t.bottom && t.bottom.el.height() || 0;
return e += t.top && t.top.el.height() || 0, s - e
  }

  function a(e, n, i, s) {
return e && e.instanceOf && e.el instanceof jQuery || (e = new r(e)), s && n.el.height(s), n.el.show(), s > n.el.height() && (i -= 20), i && n.el.width(i), e.el.appendTo(n.el), !i && n.el.width(e.el.width()), !s && n.el.height(e.el.height()), t.updateLayout(), e
  }
  this.setMe = function (e) {
t = e
  };
  var i, s, t;
  this.addTo = function (e) {
var n;
e = Component.isComponent(e) ? e.el : jQuery(e), t.ownerCt = e, e[0].resize = function (e, r) {
  n && clearTimeout(n), n = setTimeout(function () {
i = e, s = r, t.updateLayout(), n = 0
  }, 300)
}, this.el.appendTo(e), i = e.width(), s = e.height(), this.updateLayout()
  }, this.init = function () {
Static.config = {
  width: "100%",
  height: "100%",
  "class": "jfm-division"
}
  }, this.Division = function (r) {
t = this;
var f = r && r.addTo;
r && delete r.addTo, r = jQuery.extend({}, this.config, r), s = i = 0, e(r), this.top = new n({
  "class": "jfm-division-top"
}, this, function (e) {
  a(e, t.top, 0, 0)
}), this.left = new n({
  "class": "jfm-division-left"
}, this, function (e) {
  a(e, t.left, 0, u())
}), this.center = new n({
  "class": "jfm-division-center"
}, this, function (e) {
  a(e, t.center, o(), u())
}), t.center.el.css("overflow", "hidden"), this.center.el.show(), this.right = new n({
  "class": "jfm-division-right"
}, this, function (e) {
  a(e, t.right, 0, u())
}), this.bottom = new n({
  "class": "jfm-division-bottom"
}, this, function (e) {
  a(e, t.bottom, 0, 0)
}), this.add([this.top, this.left, this.center, this.right, this.bottom]), f && this.addTo(f)
  }, this.updateLayout = function () {
var e = u(),
  n = o();
t.top && t.top.el.width(i), t.bottom && t.bottom.el.width(i), t.left && t.left.el.height(e), t.right && t.right.el.height(e);
var r = t.center && t.center.el.height(e).width(n) && t.center.resize;
r && r(n, e)
  }
}, fm.Package("jfm.query"), fm.Class("QueryStr"), jfm.query.QueryStr = function (e) {
  this.setMe = function (t) {
e = t
  };
  var t;
  this.shortHand = "QueryStr", Static.main = function () {
var e = window.location.search.substring(1),
  n = e.split("&"),
  r;
t = {};
for(var i = 0; i < n.length; i++) r = n[i].split("="), t[r[0]] = r[1];
t
  }, Static.getQuery = function (e) {
return t[e]
  }
}, fm.Package("jfm.hash"), fm.Class("HashChange"), jfm.hash.HashChange = function (e) {
  function n() {
var e = location.hash.substring(1);
switch(e) {
  case "registration":
fm.isExist("com.registration.Registration") ? com.registration.Registration.onHashChange(t) : fm.Include("com.registration.Registration", t);
break;
  case "home":
fm.isExist("com.home.Home") ? com.home.Home.onHashChange(t, {}) : fm.Include("com.home.Home", t, {});
break;
  case "chat":
fm.isExist("com.chat.Chat") ? com.chat.Chat.onHashChange(t, {}) : fm.Include("com.chat.Chat", t, {});
break;
  case "register":
fm.isExist("shop.Register") ? shop.Register.hashChange(t) : fm.Include("shop.Register", t);
break;
  default:
fm.isExist("com.home.Login") ? com.home.Login.onHashChange(t) : fm.Include("com.home.Login", t)
}
  }
  this.setMe = function (t) {
e = t
  };
  var t;
  this.HashChange = function (e) {
t = e, console.log("a"), jQuery(window).hashchange(n), location.hash.length < 2 ? location.hash = "home" : n()
  }
}, fm.Package("jfm.html"), fm.Class("Span"), jfm.html.Span = function (e) {
  this.setMe = function (t) {
e = t
  }, this.shortHand = "Span", this.init = function () {
var e = Static.config = {};
e["class"] = " jfm-text"
  }, this.Span = function (e) {
if(typeof e == "string") {
  var t = e;
  e = {}, e.text = t
}
e["class"] = Component.getCSSClass(e["class"], this.config["class"]), this.el = jQuery("<span/>", e)
  }
}, fm.Package("jfm.html"), fm.Class("Img"), jfm.html.Img = function (e) {
  this.setMe = function (t) {
e = t
  }, this.shortHand = "Img", this.init = function () {
var e = Static.config = {};
e["class"] = "jfm-icon"
  }, this.Img = function (e) {
typeof e == "string" && (e = {
  src: e
}), e["class"] = Component.getCSSClass(e["class"], this.config["class"]), e.src ? this.el = jQuery("<img/>", e) : this.el = jQuery("<span/>", e)
  }
}, fm.Package("jfm.html"), fm.Class("Anchor", "jfm.component.Component"), jfm.html.Anchor = function (e, t, n) {
  this.setMe = function (e) {
t = e
  }, this.shortHand = "Anchor", this.Anchor = function (t) {
typeof t == "string" && (t = {
  html: t
});
var n = jfm.html.Items.getItems(t);
e("<a/>", t), this.add(n)
  }
}, fm.Package("jfm.html"), fm.Import("jfm.html.Span"), fm.Import("jfm.html.Img"), fm.Import("jfm.html.Anchor"), fm.Class("Items"), jfm.html.Items = function (e, t, n, r) {
  this.setMe = function (t) {
e = t
  }, Static.getItems = function (e) {
var i = [];
for(var s in e) if(e.hasOwnProperty(s)) switch(s) {
  case "text":
  case "html":
i.push(new t(e[s])), delete e[s];
break;
  case "icon":
i.push(new n(e[s])), delete e[s];
break;
  case "iconCls":
i.push(new n({
  "class": e[s]
})), delete e[s];
break;
  case "anchor":
i.push(new r(e[s])), delete e[s]
}
return "items" in e && (i.concat(e.items), delete e.items), i
  }
}, fm.Package("jfm.html"), fm.Import("jfm.html.Items"), fm.Class("Button", "jfm.component.Component"), jfm.html.Button = function (e, t, n, r) {
  this.setMe = function (e) {
t = e
  }, this.shortHand = "Button", this.init = function () {
var e = Static.Const.config = {};
e["class"] = "jfm-button-div jfm-button"
  }, this.Button = function (t) {
var i = n.getItems(t);
t.html = this.config.html, t["class"] = r.getCSSClass(t["class"], this.config["class"]), e("<button/>", t), this.add(i)
  }
}, fm.Package("jfm.lang"), fm.Class("Character"), jfm.lang.Character = function (e) {
  this.setMe = function (t) {
e = t
  }, this.shortHand = "Character", Static.Const = {
UTF_CHAR: /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
CHARS: {
  "\b": "\\b",
  "": "\\t",
  "\n": "\\n",
  "\f": "\\f",
  "\r": "\\r",
  '"': '\\"',
  "\\": "\\\\"
},
rCRLF: /\r?\n/g,
EMPTY: "",
OPEN_O: "{",
CLOSE_O: "}",
OPEN_A: "[",
CLOSE_A: "]",
COMMA: ",",
COMMA_CR: ",\n",
CR: "\n",
COLON: ":",
COLON_SP: ": ",
QUOTE: '"'
  }, Static.Const.keys = {
BACKSPACE: 8,
TAB: 9,
ENTER: 13,
SHIFT: 16,
CTRL: 17,
ALT: 18,
BREAK: 19,
CAPSLOCK: 20,
ESCAPE: 27,
PAGEUP: 33,
PAGEDOWN: 34,
END: 35,
HOME: 36,
LEFTARROW: 37,
UPARROW: 38,
RIGHTARROW: 39,
DOWNARROW: 40,
INSERT: 45,
DELETE: 46,
ZERO: 48,
ONE: 49,
TWO: 50,
THREE: 51,
FOUR: 52,
FIVE: 53,
SIX: 54,
SEVEN: 55,
EIGHT: 56,
NINE: 57,
A: 65,
B: 66,
C: 67,
D: 68,
E: 69,
F: 70,
G: 71,
H: 72,
I: 73,
J: 74,
K: 75,
L: 76,
M: 77,
N: 78,
O: 79,
P: 80,
Q: 81,
R: 82,
S: 83,
T: 84,
U: 85,
V: 86,
W: 87,
X: 88,
Y: 89,
Z: 90,
LEFT_WINDOW_KEY: 91,
RIGHT_WINDOW_KEY: 92,
SELECT_KEY: 93,
MULTIPLY: 106,
ADD: 107,
SUBTRACT: 109,
DECIMAL_POINT: 110,
DIVIDE: 111,
F1: 112,
F2: 113,
F3: 114,
F4: 115,
F5: 116,
F6: 117,
F7: 118,
F8: 119,
F9: 120,
F10: 121,
F11: 122,
F12: 123,
NUM_LOCK: 144,
SCROLLLOCK: 145,
SEMICOLON: 186,
EQUAL: 187,
COMMA: 188,
DASH: 189,
PERIOD: 190,
FORWARDSLASH: 191,
GRAVEACCENT: 192,
OPENBRACKET: 219,
BACKSLASH: 220,
CLOSEBRAKET: 221,
SINGLEQUOTE: 222
  }
}, fm.Package("jfm.io"), fm.Import("jfm.lang.Character"), fm.Class("Serialize"), jfm.io.Serialize = function (e, t) {
  function n(e) {
return t.CHARS[e] || (t.CHARS[e] = "\\u" + ("0000" + (+e.charCodeAt(0)).toString(16)).slice(-4)), t.CHARS[e]
  }

  function r(e) {
return t.QUOTE + e.replace(t.UTF_CHAR, n) + t.QUOTE
  }

  function i(e, n, s) {
if(s <= 0) return undefined;
var o = e[n],
  u = [],
  a, f, l, c, h;
f = typeof o;
if(o instanceof window.jQuery) return null;
switch(f) {
  case "object":
if(o == null) return undefined;
break;
  case "string":
return r(o);
  case "number":
return isFinite(o) ? o : t.NULL;
  case "boolean":
return o;
  default:
return undefined
}
a = o.length !== undefined && o instanceof Array ? !0 : !1;
var p;
if(a) for(var d = o.length - 1; d >= 0; --d) p = i(o, d, s - 1), p && u.push(p);
else for(l in o) o.hasOwnProperty(l) && (c = i(o, l, s - 1), c && u.push(r(l) + t.COLON + c));
return a ? t.OPEN_A + u.join(t.COMMA) + t.CLOSE_A : t.OPEN_O + u.join(t.COMMA) + t.CLOSE_O
  }
  this.setMe = function (t) {
e = t
  }, this.shortHand = "Serialize", this.Static.serialize = function (e, t) {
return i({
  "": e
}, "", t || 1e3)
  }, Static.JavaSerialize = function (e) {
e.getClass && e.getSerializable && (e = e.getSerializable());
var t = {};
if(typeof e == "object") for(var n in e) e.hasOwnProperty(n) && (e[n].getClass && e[n].getSerializable ? t[n] = this.JavaSerialize(e[n].getSerializable()) : t[n] = this.JavaSerialize(e[n]));
else t = e;
return t
  }, this.Static.un = function s(e, t) {
e = typeof e == "object" ? e : jQuery.parseJSON(e);
var n = fm.stringToObject(t),
  r = jQuery.parseJSON(bluePrints[t]) || {}, i = new n,
  o = {};
for(var u in e) r[u] ? r[u].pos == "_s_" ? o[u] = r[u].type ? s(e[u], r[u].type) : e[u] : r[u].type ? i[u] = s(e[u], r[u].type) : i[u] = e[u] : i[u] = e[u];
return i.setSerializable(o), i
  }
}, fm.Package("jfm.server"), fm.Import("jfm.io.Serialize"), fm.Class("Server"), jfm.server.Server = function (e, t) {
  this.setMe = function (t) {
e = t
  };
  var e = this;
  this.url = location.protocol + "//" + location.host + "/", this.method = "method", this.shortHand = "Server", this.type = "json", this.async = !0, this.parameters = {};
  var n;
  this.errorCallback = function (e) {
console.log(e)
  }, this.callback = function (e) {
console.log("callback", e)
  }, this.Static.newInstance = function (t, n, r, i, s, o, u) {
return new e(t, n, r, i, s, o, u)
  }, this.Static.getInstance = function (t) {
return n ? n.url = t : (n = new jfm.server.Server(t), e = n), n
  }, this.Private.Server = function (e, t, n, r, i, s, o) {
this.url = e || this.url, this.parameters = t || this.parameters, this.method = n || this.method, this.callback = r || this.callback, this.errorCallback = i || this.errorCallback, this.type = s || this.type, this.async = o || this.async
  }, this.serviceCall = function (n, r, i, s, o, u) {
try {
  u = u != undefined ? u : this.async;
  switch(typeof o) {
case "boolean":
  u = o
  }
  switch(typeof s) {
case "boolean":
  u = s;
  break;
case "string":
  o = s
  }
  switch(typeof i) {
case "boolean":
  u = o;
  break;
case "string":
  o = s
  }
  switch(typeof r) {
case "boolean":
  u = o;
  break;
case "function":
  typeof i == "function" && (s = i), i = r
  }
  switch(typeof n) {
case "boolean":
  u = o;
  break;
case "string":
  o = s;
case "function":
  typeof r == "function" && (s = r), i = n
  }
  this.parameters = typeof n == "object" && n != null ? n : this.parameters;
  var a = this.parameters;
  for(var f in this.parameters) a.hasOwnProperty(f) && typeof a[f] == "object" && (a[f] = t.serialize(a[f]));
  a.method = a.method || r || this.method;
  var l = $.ajax({
url: this.url,
type: "POST",
data: a,
success: i || this.callback,
error: s || this.errorCallback,
dataType: o || this.type,
async: u
  });
  return l
} catch(c) {
  (i || e.errorCallback)(c)
}
  }
}, fm.Package("jfm.cache"), fm.Import("jfm.server.Server"), fm.Class("Cache"), jfm.cache.Cache = function (e, t) {
  this.setMe = function (t) {
e = t
  };
  var n, r, i;
  this.shortHand = "Cache", this.getTemplate = function (e, t, i) {
typeof t == "string" ? e = t + "/" + e : typeof t == "function" && (i = t);
if(r[e]) return i && i(r[e]), r[e];
var s = i ? !0 : !1;
return n.serviceCall({
  data: e
}, s, function (t) {
  r[e] = t, i && i(t)
}), r[e]
  }, this.Static.getInstance = function () {
return i || (i = new Cache), i
  }, this.Cache = function () {
n = t.newInstance("template", undefined, "getTemplate", null, null, "html"), r = {}
  }
}, fm.Package("jfm.html"), fm.Class("Constants"), jfm.html.Constants = function (e) {
  this.setMe = function (t) {
e = t
  }, Static.Const = {
mail: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
  }
}, fm.Package("jfm.html"), fm.Import("jfm.lang.Character"), fm.Import("jfm.html.Img"), fm.Import("jfm.html.Span"), fm.Class("Popup", "jfm.html.Container"), jfm.html.Popup = function (e, t, n, r, i, s) {
  this.setMe = function (e) {
t = e
  }, this.shortHand = "Popup";
  var o, u, a, f, l, t = this;
  this.Private.Popup = function (i) {
f = i;
var l = document.documentElement.scrollTop,
  c = document.documentElement.scrollLeft + 100,
  h = {
"class": "jfm-popup",
css: {
  top: l,
  left: c,
  display: "none"
}
  };
e(h), u = new s({
  "class": "jfm-body"
}), o = new s({
  "class": "jfm-head unselectable"
}), a = new r({
  "class": "jfm-close",
  src: "img/close-button.jpg",
  width: "auto",
  height: "auto"
}), this.add([a, o, u]), a.el.bind("click", function () {
  t.hide()
}), this.method("keyup", function (e) {
  e.keyCode == n.keys.ESCAPE && t.hide()
}), this.el.appendTo("body")
  }, Static.getInstance = function () {
return l || (l = new jfm.html.Popup), l
  }, this.pBody = function (e) {
return u.el.empty(), u.add(e), u.el.children()
  }, this.hide = function () {
return this.el.hide(), f && f(), !0
  }, this.pHead = function (e) {
return o.el.empty().show().width(u.el.width()), o.add(e), o
  }, this.getContainer = function () {
return u.el.children()
  }, this.show = function (e, t) {
this.updateLayout(e, t), this.el.fadeIn(250, function () {
  o.el.width(u.el.width())
}), this.el.trigger("focus")
  }, this.updateLayout = function (e, t) {
var n = parseInt(this.el.css("width"), 10),
  r = parseInt(this.el.css("height"), 10),
  i = $(document).scrollTop(),
  s = $(document).scrollLeft(),
  a = $(window).width() - 10,
  f = $(window).height() - 24;
isNaN(n) && (n = this.el.width()), isNaN(r) && (r = this.el.height()), s += (a - n) / 2, i = f - r > 0 ? i + (f - r) / 2 : i, e = e ? e : 0, t = t ? t : 10, this.el.css({
  top: i + t,
  left: s + e
}), o.el.width(u.el.width())
  }, this.showHint = function (e) {
var t = new i({
  text: e.attr("hintText"),
  css: {
"text-align": "right",
color: "#666"
  }
});
t.el.width(e.width() + 20).height(e.height() - 3).css("margin-top", "3px"), this.pBody(t.el), u.el.css("margin", 0), o.el.hide(), a.el.hide();
var n = e.position().left - e.width() - 30,
  r = e.position().top;
this.el.css({
  left: n,
  top: r,
  padding: "0",
  margin: "0"
}), this.el.show()
  }, this.hideHint = function () {
u.el.css("margin", ""), this.el.css({
  padding: "",
  margin: ""
}), this.hide()
  }
}, fm.Package("jfm.html.form"), fm.Import("jfm.html.Constants"), fm.Import("jfm.html.Popup"), fm.Class("Text"), jfm.html.form.Text = function (e, t, n) {
  function o(e) {
switch(s) {
  case "email":
u(e);
break;
  case "number":
a(e)
}
  }

  function u(e) {
if(e && e.search(t.mail) == -1) throw "Please enter a valid email address."
  }

  function a(e) {
if(e && isNaN(e)) throw "Only Number is allowed!"
  }

  function f(e) {
i && this.value == i && String.fromCharCode(e.keyCode) && (this.value = "", this.style.color = r)
  }

  function l(e) {
!this.value && i && (this.style.color = "#666666", this.value = i, p(this, 0, 0))
  }

  function c() {
try {
  o(this.value), this.value && jQuery(this).next().show().removeClass("fail").addClass("pass")
} catch(e) {
  jQuery(this).next().show().removeClass("pass").addClass("fail")
}
  }

  function h() {
this.value == i && p(this)
  }

  function p(e) {
if(e.createTextRange) {
  var t = e.createTextRange();
  t.collapse(!0), t.moveEnd("character", 0), t.moveStart("character", 0), t.select()
} else e.setSelectionRange && (e.focus(), e.setSelectionRange(0, 0))
  }

  function d(e) {
e.before('<label class="placeholder"> ' + i + " </lebel>")
  }
  this.setMe = function (t) {
e = t
  };
  var r, i, s;
  this.init = function () {
Static.isPlaceHoderSuported = "placeholder" in document.createElement("input")
  }, this.Text = function (e) {
e instanceof jQuery ? this.el = e : e.nodeType == 1 ? this.el = jQuery.apply(this, arguments) : this.el = jQuery.call(this, "<input />", e), this.el.attr("autocomplete", "off"), this.el.blur(c).click(h).keyup(l).keydown(f), r = this.el.css("color"), s = this.el.attr("datatype"), i = "testing..", d(this.el)
  }, Static.convertToJfm = function (e) {
var t = [];
return e instanceof jQuery && e.each(function () {
  this.type == "text" && t.push(new jfm.html.form.Text(this))
}), t
  }, this.verify = function (e) {
o(e)
  }
}, fm.Package("com.post"), fm.Import("jfm.cache.Cache"), fm.Import("jfm.html.form.Text"), fm.Class("Top", "jfm.html.Button"), com.post.Top = function (e, t, n, r, i) {
  this.setMe = function (e) {
t = e
  }, this.Top = function (t) {
e({
  html: "Post",
  "class": "green-btn",
  css: {
"background-color": "#ccc",
position: "absolute",
right: "5px"
  }
}), this.el.click(function (e) {
  n.getInstance().getTemplate("post", function (e) {
t.reset(), t.add(new Container({
  html: e
})), t.el.find("form").submit(function (e) {
  e.preventDefault();
  var t = jfm.html.FormManager.getData(this);
  return Server.getInstance("post").serviceCall(t, "save"), !1
}), setTimeout(function () {
  jfm.html.form.Text.convertToJfm(t.el.find("input[type='text']"))
}, 100)
  })
})
  }
}, fm.Package("jfm.html"), fm.Class("Combobox", "jfm.html.Container"), jfm.html.Combobox = function (e, t, n) {
  function b(e) {
var t = jQuery(e).find("option:first"),
  n = [];
while(t.length) n.push({
  k: t.html(),
  v: t.val()
}), t = t.next();
return n
  }

  function w(e) {
var t = [],
  n;
for(var r = 0; r < e.length; r++) n = {
  v: r,
  k: e[r]
}, t.push(n);
return t
  }

  function E() {
var e = f.shortKey.replace(/\s/g, "").toLowerCase().split("+");
if(e.length == 0) return !1;
var t = {
  ctrlKey: !1,
  shiftKey: !1,
  altKey: !1
}, n = {};
for(var r in e) e[r].length > 1 ? t[e[r] + "Key"] = !0 : n[e[r].toLowerCase()] = !0;
return {
  base: t,
  other: n
}
  }

  function S(e) {
var t = E(),
  n = t.base,
  r = t.other,
  i = function (e) {
return e["ctrlKey"] == n["ctrlKey"] && e["shiftKey"] == n["shiftKey"] && e["altKey"] == n["altKey"] && r[String.fromCharCode(e.keyCode).toLowerCase()] ? !0 : !1
  };
return i(e)
  }

  function x() {
return $("<input />", {
  "class": "input_combo",
  name: f.name
}).css(f.inputBoxCSS).appendTo(r)
  }

  function T() {
var e = {
  display: "none",
  overflow: "auto",
  "overflow-x": "hidden"
};
return $("<div />", {
  "class": "combo_popup",
  css: e
}).css(f.resultBoxCSS).appendTo("body")
  }

  function N() {
return $("<div />", {
  "class": "combo_btn"
}).appendTo(r)
  }

  function C() {
return $("<div />", {
  "class": "combo-loading",
  css: {
display: "none"
  }
}).appendTo(r)
  }

  function k() {
r.css({
  position: "relative"
}).empty(), l = x(), p = T(), f.hideButton ? f.showLoadingIcon && (d = C()) : (d = N(), d.click(_))
  }

  function L(e) {
var t = [];
h = [];
for(var n = 0, r = e.length; n < r; n++) h.push(e[n].v), t.push({
  k: e[n].k,
  v: n
});
return t
  }

  function A(e) {
var t = L(e);
return a = t, e = null, c = z(t, f.depth, 0), f.hintText != "" ? F(f.hintText) : f.triggerAtStart && !f.noFillUpAtStart && (u = U(f.defaultText, c, f)[0], u = u || t[0], F(), s.onChange(u)), t = null, c
  }

  function O(e) {
switch(e.keyCode) {
  case g:
  case m:
break;
  case y:
return v.trigger("click"), $(this).trigger("blur"), !1;
  default:
q($(this).val())
}
  }

  function M(e) {
switch(e.keyCode) {
  case g:
v.length ? v.next().length && v.next().trigger("FocusOn") : (v = $("li:first", p), v.trigger("FocusOn"));
break;
  case m:
v.prev().length && v.prev().trigger("FocusOn");
break;
  case y:
return !1
}
  }

  function _() {
l.select(), l.focus(), q()
  }

  function D() {
f.hintText != "" && $.trim(this.value) == $.trim(f.hintText) && (this.value = "", this.style.color = "#000000")
  }

  function P() {
f.hintText != "" && $.trim(this.value) == "" && (this.value = $.trim(f.hintText), this.style.color = "#666666")
  }

  function H(e) {
$(e.target).trigger("FocusOn", !0);
return
  }

  function B(e, t) {
var n = e.target;
if(n.nodeName.toUpperCase() != "LI") return;
v.removeClass("selected");
var r = p.height();
v = $(n), v.addClass("selected"), t || (p[0].scrollTop = (v.index() + 1) * 25 - r);
return
  }

  function j(e) {
var t = e.target;
if(t.nodeName.toUpperCase() != "LI") return;
var n = $(t),
  r = h[n.attr("key")];
u = {
  k: n.text(),
  v: r
}, F(), u.v && u.v != "" && s.onChange(u), p.hide(), l.blur();
return
  }

  function F(e) {
e && e != "" ? l.val(e).css("color", "#666666") : l.val(u.k).attr("key", u.v).css("color", "")
  }

  function I(e, t) {
if(typeof f.resultFunction == "function") {
  f.resultFunction(e, h);
  return
}
var n = l.offset(),
  r = parseInt(p.css("height")),
  i = $(window).height();
r > i - n.top && (n.top = n.top - r - l.height()), p.empty().width(l.width()).css({
  display: "",
  top: n.top + l.height(),
  left: n.left
});
if(!e.length && isNaN(t)) {
  p.html("It is not present in the list");
  return
}
var s = R(e);
s.appendTo(p), (v = $("li:first", s)).trigger("FocusOn")
  }

  function q(e) {
f.ignoreNumberOfCharacters == 0 && (e = e ? e : "");
if(e == undefined) {
  p.hide();
  return
}
e.length == 0 && r.trigger("combo_data_cleared");
if(e.length < f.ignoreNumberOfCharacters) {
  e.length != 0 && r.trigger("combo_data_cleared"), p.hide();
  return
}
var t;
f.searchFunction ? t = f.searchFunction(e, a) : t = U(e, c, f), t.length ? I(t) : o ? (d && d.show(), o(e, function (t) {
  p.empty();
  var n = L(t);
  I(n, e), d && d.hide()
})) : (I([]), p.hide())
  }

  function R(e) {
var t = $("<ul/>", {}),
  n = 0;
t.attr("tabindex", 2);
var r = "",
  i = e.length;
for(; n < i; n++) r += "<li style='line-height:25px;display: block; cursor: pointer' key='" + e[n].v + "'>" + e[n].k + "</li>";
return t.html(r), t
  }

  function U(e, t, n) {
function r(t, n, i) {
  var s, o = t,
u = e.length,
a = u < n ? u : n;
  for(var f = i; f < a; f++) {
s = e.charAt(f), o = o[s];
if(!o) return []
  }
  if(u > a) {
var l = z(o, u - 1, a);
o = r(l, u + 1, a)
  }
  return o
}

function s(e, t, n) {
  if(!e) return [];
  var r = [],
o;
  if(e[0] && typeof e[0].k != "object" && typeof e[0].k != "undefined") {
for(o in e) {
  var u = e[o].k;
  if(!(u.length >= t && n > i)) break;
  i++, r.push(e[o])
}
return r
  }
  for(var a in e) {
r = r.concat(s(e[a], t, n));
if(i >= n) break
  }
  return r
}
e = e.toLowerCase();
var i = 0,
  o = r(t, n.depth + 1, 0);
return s(o, e.length, n.maxDisplayResult)
  }

  function z(e, t, n) {
function i(e, r) {
  var i;
  for(var s = n; s < t; s++) i = r.charAt(s).toLowerCase(), e[i] = e[i] || {}, e = e[i];
  return i = r.charAt(s).toLowerCase(), e[i] = e[i] || [], e[i]
}

function s(e) {
  var t;
  for(var n = 0, s = e.length; n < s; n++) t = e[n], i(r, t.k).push(t);
  return r
}
var r = {};
return s(e)
  }
  this.setMe = function (e) {
t = e
  }, this.shortHand = "Combobox";
  var r, i, s, o, u, a, f, l, c, h, p, d, v = $("noelem"),
m = 38,
g = 40,
y = 13;
  this.Combobox = function (t, n, i) {
o = i, s = this, e({
  "class": Component.getCSSClass(n.class + " jfm-combobox")
}), r = this.el;
if(t == null) throw "list size is zero!";
f = {
  defaultText: "",
  name: "",
  maxDisplayResult: 1e3,
  triggerAtStart: !0,
  hideButton: !1,
  showLoadingIcon: !1,
  ignoreNumberOfCharacters: 0,
  noFillUpAtStart: !1,
  depth: 2,
  hintText: "",
  inputBoxCSS: {},
  onKeyDown: undefined,
  onKeyUp: undefined,
  resultBoxCSS: {},
  inputTabIndex: -1,
  shortKey: "ctrl + shift + c",
  searchFunction: undefined,
  resultFunction: undefined
}, f = jQuery.extend(f, n), k(), t = this.updateData(t, n), l.attr("tabindex", f.inputTabIndex).keyup(O).keydown(M).click(_).focus(D).blur(P), p.mousemove(H).bind("FocusOn", B).click(j), $(document).bind("click", function (e) {
  if(d && d.get(0) == e.target) return;
  if(l.get(0) == e.target) return;
  p.hide()
}), $(document).keydown(function (e) {
  return S(e) && r[0].offsetLeft != 0 && r[0].offsetTop != 0 ? (_(), !1) : !0
})
  }, this.getSelected = function () {
return {
  key: this.el.find("input").val(),
  value: this.el.find("input").attr("key")
}
  }, this.updateData = function (e, t) {
!e && (e = []);
if(e.length > 0 && typeof e[0] == "string") e = w(e);
else if(e.nodeName == "SELECT") {
  var n = b(e);
  t.name = t.name || e.name, jQuery(e).after(this.el), jQuery(e).hide(), e = n
}
return A(e), e
  }, this.onChange = function (e) {
typeof e == "function" ? i = e : typeof i == "function" && i(e.v, e.k)
  }, this.updateKey = function (e, t) {
key = e.toString().toLowerCase();
var n = c;
for(var r = 0; r <= f.depth; r++) {
  n = n[key.charAt(r)];
  if(n == undefined) break
}
if(n != undefined) {
  for(var i in n) if(n[i].k && n[i].k.toLowerCase() == key) {
h[n[i].v] = t;
break
  }
} else this.addNewEntry(key, t)
  }, this.addNewEntry = function (e, t) {
key = e.toString();
var n = h.length;
h.push(t);
var r = [{
  v: n,
  k: e
}],
  i = c,
  s, o = z(r, f.depth, 0);
for(var u = 0; u <= f.depth && u < key.length; u++) {
  s = key.charAt(u).toLowerCase();
  if(i[s] == undefined) break;
  i = i[s], o = o[s]
}
i[s] == undefined ? i[s] = o[s] : i.push(o), a.push(r[0]), h.push(t)
  }
}, fm.Package("com.region"), fm.Import("jfm.html.Span"), fm.Import("com.post.Top"), fm.Import("jfm.html.Combobox"), fm.Class("Topbar", "jfm.html.Container"), com.region.Topbar = function (e, t, n, r, i, s) {
  function u() {
return;
var e
  }

  function a(e) {
return e.target.nodeName == "SPAN" ? (o && o.hide(), o = $(e.target).next().show()) : e.target.nodeName == "A" && (o.hide(), fm.isExist("com.home.SubCategory") ? com.home.SubCategory.showSubCategory(e.target.href) : fm.Include("com.home.SubCategory", [e.data, e.target.href])), !1
  }
  this.setMe = function (e) {
t = e
  };
  var o;
  this.Topbar = function (t) {
e({
  height: 100,
  css: {
"background-color": "#FCF0FE"
  }
}), u();
var n = this;
this.add(new s({
  html: "<a href='#'>Kerana</a>",
  "class": "logo"
}));
var r;
this.add(new Button({
  html: "Register",
  "class": "register green-btn",
  click: function () {
return location.hash = "register", !1
  }
})), $(document).click(function () {
  o && o.hide()
}), Cache.getInstance().getTemplate("home", function (e) {
  n.el.append(e), n.el.find(".category").click(t, a)
})
  }
}, fm.Include("plugin.Hashchange"), fm.Import("jfm.division.Division"), fm.Import("jfm.query.QueryStr"), fm.Import("jfm.hash.HashChange"), fm.Import("com.region.Topbar"), fm.Class("App"), App = function (e, t, n, r, i) {
  function s() {
$(window).ready(function () {
  var e = jQuery(window);
  e.resize(function () {
var t = e.width(),
n = e.height(),
  r = $("body").width(t).height(n)[0].resize;
r && r(t, n)
  }), $("body").trigger("resize")
})
  }
  this.setMe = function (t) {
e = t
  }, Static.main = function () {
s();
var e = new jfm.division.Division({
  id: "jfm-division",
  "class": "bg"
}),
  t = new i(e);
new jfm.hash.HashChange(e), n.getQuery("method") == "verify" && (location.hash = "registration"), e.top.add(t), e.addTo("body")
  }
}, fm.isConcatinated = !1