
fm.Package("com.test");
fm.Class("Writer");
com.test.Writer = function ( me){this.setMe=function(_me){me=_me;};

    var textarea, form;
    function send(text){        
        Server.getInstance("chat", "setDataToFile").serviceCall({data:text});
    }
    this.init = function(){
         form.submit(
            function(){
                var text = textarea.value;
                textarea.value = "";
                send(text);
                return false;
            });  
    };
    this.Writer = function () {
        textarea = $("#writer textarea")[0];
        form = $("#writer-form");
            
    };
};

