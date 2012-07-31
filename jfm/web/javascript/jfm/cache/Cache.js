/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


fm.Package("jfm.cache");
fm.Import("jfm.server.Server");
fm.Class("Cache");
jfm.cache.Cache = function (me, Server){this.setMe=function(_me){me=_me;};

    var tmplServ, tmpltMethod, tempalateStorage, singleton ;
    this.shortHand = "Cache";
    this.getTemplate = function(name, path, cb){
        
        if(typeof path == 'string'){
            name = path + "/" +name;
        }
        else if (typeof path == 'function'){
            cb = path;
        }
        if(tempalateStorage[name]){
        	cb && cb(tempalateStorage[name]);
            return tempalateStorage[name];
        }
        var async = cb ? true:false;
        tmplServ.serviceCall({
            data:name
        },tmpltMethod, function(resp){
            tempalateStorage[name] = resp;  
            cb && cb(resp);
        }, null, 'html', async);
        
        return tempalateStorage[name];
    };
    this.Static.getInstance = function(){        
        if(!singleton){
            singleton = new Cache();
        }
        return singleton;
    };
    this.Cache = function(){
    	tmplServ = Server.makeInstance("template");
        tmpltMethod = "getTemplate";
        tempalateStorage = {};
    };
};

