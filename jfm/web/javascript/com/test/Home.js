

fm.Package("com.test");
fm.Import("jfm.util.HashMap");
fm.Import("jfm.lang.Integer");
fm.Import("jfm.io.Serialize");
fm.Implements("jfm.io.Serializable");
fm.Class("Home", "com.test.HomeBaseClass");
Home = function () {
    var singleton;
    Static.Const.M = "asas";
    this.hashMap = new HashMap("a1", new Integer(4));
    this.intger = new Integer(56);
    Const.Static.ABCS = 2323;
    function abcd(){
       me.start(); 
    }
    Static.getInstance = function () {
        if (!singleton) {
            singleton = new me();
        }
        return singleton;
    };
    
    this.start = function(){
        return base.start();
    };
    
    this.setSerializable = function(obj){
        this.hashMap.setSerializable(obj.hashMap);
        this.intger.setSerializable(obj.integer);
    };
    
    this.getSerializable = function(){
        return obj = {
            hashMap : this.hashMap,
            integer : this.intger
        };
    };
    
    Private.Home = function () {
       
        this.hashMap.put("key1", new Integer(2));
        this.hashMap.put("key2", new Integer(2))
        base = base( this.getFunctionName() +" called from " + arguments[0] );
         abcd();
    };
};
