/**
 * Created with JetBrains WebStorm.
 * User: anoop
 * Date: 5/10/12
 * Time: 2:33 AM
 * To change this template use File | Settings | File Templates.
 */

fm.Package("com.test2");
fm.Interface("FirstInterface", "com.test.SecondInterface");
FirstInterface = function( base, me, SecondInterface){this.setMe=function(_me){me=_me;};

    this.interfaceMethod = function(){};
};


