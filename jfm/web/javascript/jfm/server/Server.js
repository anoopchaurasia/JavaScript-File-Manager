/**
 * Created with JetBrains WebStorm.
 * User: anoop
 * Date: 5/12/12
 * Time: 5:42 PM
 * To change this template use File | Settings | File Templates.
 */

fm.Package("jfm.server");
fm.Import("jfm.io.Serialize");
fm.Class("Server");
jfm.server.Server = function(im){
    var me = this;
    this.url = location.protocol + "//" + location.host + "/" ;
    this.method = "process";
    this.shortHand = "Server";
    this.type = "html";
    this.async = true;
    this.parameters = {};
    var singleton;
    
    this.errorCallback = function(msg) {
    	location.hash = msg.responseText;
        console.log(msg);
    };
    this.callback = function(msg) {
    	console.log("callback", msg);
    };
    
    this.Static.makeInstance = function(url){
    	return new jfm.server.Server(url);
    };
    
    this.Static.getInstance = function( url){  

    	
        if(!singleton){
            singleton = new jfm.server.Server( url);
            me = singleton;
        }
        else{
        	singleton.url = url;
        }
        return singleton;
    };
    this.Private.Server = function( url){

        this.url = url || this.url;
    };
    this.serviceCall = function( parameters, method, cb, err, type, async) {
        try {
            this.parameters = parameters || this.parameters || {};
            this.parameters.method = method;
            var param = this.parameters;
            for(var k in this.parameters){
                param.hasOwnProperty(k) && (typeof param[k] == 'object') && (param[k]=im.Serialize.serialize(param[k] ));
            }   
            async = async != undefined? async : this.async;
            var aj = $.ajax({
                url : this.url,
                type : "POST",
                data : param,
                success : cb || this.callback,
                error : err ||  this.errorCallback,
                dataType : type || this.type,
                async : async
            });
            return aj;
        }
        catch (r) {
            (cb || me.errorCallback)(r);
        }
    };
};