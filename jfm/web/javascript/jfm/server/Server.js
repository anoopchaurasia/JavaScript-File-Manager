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
    this.Static.url = location.protocol + "//" + location.host + "/" ;
    this.Static.method = "process";
    this.shortHand = "Server";
    this.type = "html";
    this.async = true;
    this.parameters = {};
    var singleton;
    this.Static.setDefault = function( url, method, parameters, type, async ){

        this.url = url || this.url;
        this.method = method || this.method;
        this.parameters = parameters || this.parameters;
        this.type = type || this.type;
        this.async = async == undefined ?  this.async: async ;
    };
    this.errorCallback = function(msg) {
    	location.host = msg.responseText;
        console.log(msg);
    };
    this.callback = function(msg) {

    };
    this.Static.getInstance = function( url){  

        this.url = url || this.url;        
        if(!singleton){
            singleton = new jfm.server.Server( url);
            me = singleton;
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