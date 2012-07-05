/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

fm.Package("com.web");
fm.Class("Home", "jfm.html.Container");
com.web.Home = function(){    
    this.Home = function(){
        var self = this;
        base();
        self.el.html(Cache.getInstance().getTemplate('home'));
       
        
        self.el.find("form").submit(function(){
            var data;
            try{
                data = FormManager.getData(this);
            }catch(e){
                alert(e);
                return false;
            }
            Server.getInstance("Home").serviceCall( data, 'join', function(resp){
                alert(Serialize.serialize(resp));
            });
            return false;
        });
        setTimeout(function(){
            jfm.html.form.Text.convertToJfm(self.el.find("input[type='text']"));
        });
         
    };
};