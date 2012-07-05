/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

fm.Package("com.region");

fm.Import("jfm.html.form.Text");
fm.Import("jfm.html.Combobox"); 
fm.Import("jfm.cache.Cache");
fm.Import("jfm.html.FormManager");
fm.Class("Center", 'jfm.html.Container');

com.region.Center = function(){
    this.Center = function(){
        base({
            width:'100%',
            css:{
                'background-color':'#cedae3'
            }
        });
    };
    this.updateRegion = function(){
        var self = this;
       
    };
};

