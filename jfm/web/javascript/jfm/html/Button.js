/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
fm.Package("jfm.html");
fm.Import("jfm.html.Items");
fm.Class("Button", 'jfm.html.Container');
jfm.html.Button = function(im, base){    

    this.shortHand = "Button";
    this.init = function(){
        var c = Static.Const.config = {};
        c['class']  = "jfm-button-div";
        c.html = '<button class="jfm-button">'+
                      '</button>';
    };
    
    this.Button = function(config){
        var items = im.Items.getItems(config);
        config.html = this.config.html;
        config["class"] = Component.getCSSClass(config["class"], this.config['class']);
        base(config);
        this.add(items);
    };

    this.add = function(){
        var btn = this.el.find("button:first")[0].jfm || new Component(this.el.find("button:first"));
        btn.add.apply(btn, arguments);
    };
};
