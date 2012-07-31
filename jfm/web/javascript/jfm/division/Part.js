 
fm.Package("jfm.division");
fm.Class("Part","jfm.component.Component");
jfm.division.Part = function (base, me, Component){this.setMe=function(_me){me=_me;};

    var set, division;    
    this.Part = function(config, divsn, s){
        set = s;
        division = divsn;
        config.css = config.css || {};
        config.css.display = 'none';
        base('<div />',config);
    };
    
    this.add = function(elem){        
        set(elem);
    };
    
    this.reset = function(){
        this.el.empty();
        this.el.css({ 'display':'none',height:0, width:0 });
        division.updateLayout();
    };
};

