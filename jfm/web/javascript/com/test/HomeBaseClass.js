
fm.Package( "com.test" );
fm.Class( "HomeBaseClass", "com.test2.BaseOfBaseClass");
com.test.HomeBaseClass = function (base, me, BaseOfBaseClass){this.setMe=function(_me){me=_me;};

    var me = this;
    this.D ="D";
    Const.Anoop = "Anoop";
    this.Static.Ano = "Anooppppppppppppppp";
    me.HomeBaseClass = function( ){  
        base = base(me.getFunctionName() +" called from " + arguments[0] );
    };
    this.start = function(){
        return base.start();
    }
    //TODO: Implement Base methods in interface
   // this.AB = function(){};
};

