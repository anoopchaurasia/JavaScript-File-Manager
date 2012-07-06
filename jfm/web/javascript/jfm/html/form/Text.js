fm.Package("jfm.html.form");
fm.Import("jfm.html.Constants");
fm.Import("jfm.html.Popup");
fm.Class("Text");
jfm.html.form.Text = function(){
    var originalColor, hintText, datatype;
    this.Text = function(config){
        
        if(config instanceof jQuery){
            this.el = config;
        }
        else if(config.nodeType == 1){
            this.el = jQuery.apply(this, arguments);
        }
        else{
            this.el = jQuery.call(this,'<input />', config);
        }
        this.el.attr("autocomplete","off");
        this.el.blur(el_blur).click(el_click).keyup(el_keyup).keydown(el_keydown);
        originalColor = this.el.css('color');
        datatype = this.el.attr("datatype");
        hintText = this.el.attr('hintText');
        hintText && enableHint(this.el);
        addLogo(this.el);
    };    
    
    Static.convertToJfm = function(inputs){  
        var arr = [];
        if(inputs instanceof jQuery){
            inputs.each(function(){
                if(this.type == 'text'){
                    arr.push(new jfm.html.form.Text(this));
                }
            });
        }
        return arr;
    };
    
    function addLogo(el){
        var icon;
       switch(datatype){        
            case 'email':{
                icon = "<span class='typeIcon' ></span>";
                break;
            }
            case 'number':{
                icon = "<img class='typeIcon' src='http://www.tutorialsscripts.com/free-icons/alphabet-characters/lower-case-letter/n-icon/red-small-letter-character-n-icon-256-x-256.jpg' />";
                break;
            }
       }
       if(icon){
           el.parent().addClass("iconHandler");
           el.width(el.width() - 33);
           el.before(icon).after("<span class='validityHinter'></span>");
       }
    }
    
    function varifyValue(value){
        switch(datatype){
            case 'email':{
                mailCheck(value);
                break;
            }
            case 'number':{
                numbercheck(value);
                break;
            }
        }
    }
    
    this.verify = function(value){
        varifyValue(value);
    };
    
    function mailCheck(value){
        if(value && value.search(Constants.mail) == -1){
            throw "Please enter a valid email address.";
        }
    }
    
    function numbercheck(value){
        if(value && isNaN(value)){
            throw "Only Number is allowed!";
        }
    }
    
    function el_keydown(e){
        if(hintText){
            if(this.value == hintText && String.fromCharCode(e.keyCode)){
                this.value = "";
                this.style.color = originalColor;
            }           
        }else{
            this.select();
        }
    }
    
    function el_keyup(e){
        if(!this.value){
            
            this.style.color = "#666666";
            this.value = hintText;
            textSelect(this, 0, 0);
        }
    }
    
    function el_blur(){
        try{
            varifyValue(this.value); 
            jQuery(this).next().show().removeClass("fail").addClass("pass");
        }catch(e){
        	jQuery(this).next().show().removeClass("pass").addClass("fail");
        }
    }
    function el_click(){
        this.value == hintText && textSelect(this);
    }
    function textSelect(inp) {
        if (inp.createTextRange) {
            var r = inp.createTextRange();
            r.collapse(true);
            r.moveEnd('character', 0);
            r.moveStart('character', 0);
            r.select();
        }else if(inp.setSelectionRange) {
            inp.focus();
            inp.setSelectionRange(0, 0);
        }
    }
    
    function enableHint (self){        
        if(!self.val()){            
            self.css('color','#666');
            self.val( hintText );
        }
    }
};