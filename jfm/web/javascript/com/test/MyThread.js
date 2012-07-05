/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
fm.Package("com.test");
fm.Class("MyThread", "jfm.lang.Thread");
com.test.MyThread = function(){    
    this.shortHand = "MyThread";
    this.run = function(t){        
        return function(){
            try{
                throw "Testing ....";
            }
            catch(e){
                console.log(e);
                t.sleep( 5000 );
            }
        }
    };
};