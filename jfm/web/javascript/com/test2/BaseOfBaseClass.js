/**
 * Created by JetBrains WebStorm.
 * User: anoop
 * Date: 8/8/11
 * Time: 1:50 AM
 * To change this template use File | Settings | File Templates.
 */
 
fm.Package("com.test2");
fm.AbstractClass( "BaseOfBaseClass");
BaseOfBaseClass = function (me){this.setMe=function(_me){me=_me;};


    this.Const.AL = "ALCONST";
    Abstract.abcde = function(){};
    this.Static.Const.Anoop1 = "Anoop1";
    this.Ano = "Ano";
    this.BaseOfBaseClass = function( arg1 ){  
        this.k = 67;
        $("div:first").html(arg1);
    };
    this.start = function(){
        return 678;
    }
};

