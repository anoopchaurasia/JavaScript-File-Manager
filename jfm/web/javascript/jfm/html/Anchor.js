/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
fm.Package("jfm.html");
fm.Class("Anchor", "jfm.component.Component");
jfm.html.Anchor = function(im, base){
    this.shortHand = "Anchor";
    this.Anchor = function(config){
        if(typeof(config) == 'string'){
            config = {
                html:config
            };
        }
        var items = jfm.html.Items.getItems(config);
        base('<a/>', config);
        this.add(items);
    };
};

