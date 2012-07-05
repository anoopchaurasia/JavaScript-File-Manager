
fm.Package("com.test");
fm.Import("jfm.lang.Thread");
fm.Implements("jfm.lang.Runnable");
fm.Class("Reader");
com.test.Reader = function () {
    var cont, timeStamp;
    this.run = function(t){
        return function looper(){
            Server.getInstance("chat","getDataFromFile").serviceCall({timeStamp:timeStamp||0},function(resp){
               if(resp && resp.text == undefined){
                   try{
                       resp = jQuery.parseJSON(resp);
                   }catch(e){
                       console.log(e);
                   }
               }
               resp = resp || {};
               if(resp.text){
                    cont.append("<div>"+ resp.text + "</div>");
                }
                timeStamp  = resp.time;
                t.sleep(15000);
            },function(){
                 t.sleep(15000);
            });
        }
    };
    this.Reader = function ( ) {  
        timeStamp = 0;
        cont = $("#reader");
    };
};