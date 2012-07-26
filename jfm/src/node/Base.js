/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

fm.AbstractClass("Base");
Base = function(){    
    this.Abstract.method = function(){};
    this.POST = function(req, resp, t){
       
       var method = req.params.method || 'method';
       var cls = this.getSub();
       cls[method](req, resp, t);
    };

    this.GET = function(req, resp){
        this.POST(req, resp);
    };
};