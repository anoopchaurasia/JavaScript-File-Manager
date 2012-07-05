fm.Package("jfm.util");
fm.Base("jfm.util.Store");
fm.Interface("Map");

jfm.util.Map = function () {
	
	this.containsValue = function(){};
	this.containsKey = function(){};
	this.get = function(){};
	this.put = function(){};
	this.putAll = function(){};
	this.keySet = function(){};
	this.values = function(){};
	this.entrySet = function(){};
};