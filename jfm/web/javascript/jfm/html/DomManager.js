/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
fm.Package("jfm.html");
fm.Import("jfm.html.FormManager");
fm.AbstractClass("DomManager", "jfm.html.Container");
jfm.html.DomManager = function (base, me, FormManager){this.setMe=function(_me){me=_me;};

    function invoke (fn, args){

        switch(args.length){
            case  0: return fn();
            case  1: return fn(args[0]);
            case  2: return fn(args[0], args[1]);
            case  3: return fn(args[0], args[1], args[2]);
            case  4: return fn(args[0], args[1], args[2], args[3]);
            case  5: return fn(args[0], args[1], args[2], args[3], args[4]);
            case  6: return fn(args[0], args[1], args[2], args[3], args[4], args[5]);
            case  7: return fn(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
            case  8: return fn(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
            case  9: return fn(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8]);
            case 10: return fn(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9]);
            case 11: return fn(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10]);
            default: return fn(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9],
                               args[10], args[11],args[12],args[13],args[14],args[15],args[16],args[17],args[18], args[19], args[20]);
        }
    }
    function getFunction(str, obj){
        var method = obj;
        var args = str.match(/\((.*?)\)/g)[0].replace(/\s|\(|\)/g,"").split(",");
        str = str.replace(/\s|\((.*?)\)/g,"").split(".");
        for(var i=0; i < str.length && method; i++){
            method = method[str[i]];
        }
        var temp;

        for(var i=0; i<args.length; i++){
            temp = getValue(args[i], obj);
            args[i] = temp[0][temp[1]];
        }
        return function(){
            invoke(method, args);
        }
    }

    function getValue(str, obj){
         str = str.replace(/\s/g,"").split("."), v = obj;
        for(var i=0; i < str.length - 1 && obj; i++){
            obj = obj[str[i]];
        }
        return [obj, str[i]];
    }
    var arr = [];
    function registerForChange ( method, element) {
        if(!method){
            return;
        }
        arr.push( {method:method, element: element} );
    }

    function changed(){
        for(var i=0; i < arr.length; i++){
            if(typeof arr[i].method == 'function'){
                arr[i].method(arr[i].element);
            }
        }
    }

    function applyChange(temp, controllr, name,  value, old, c_name){
        if(temp.change){
             temp.change( name, value, old, temp );
        }
        else if(controllr.change){
            controllr.change( name, value, old, temp );
        }
        changed();
       // me.el.find("[fm-*='" + c_name + "']").text(value);
    }
    this.DomManager = function(){
        var classObj = this.getSub();
        var name = classObj.getClass().toString();
        var element = jQuery("[fm-controller='" + name + "']");
        base(element);
        element.find("[fm-]").each(function(){
            var attr, str= this.getAttribute('fm-')
                                    .replace(/\s/g,"")
                                    .replace(/click:(.*?)\)/g,'"click":function(){ return $1)}' )
                                    .replace(/innerText:(.*?),|innerText:(.*?)\}$/g,'"innerText":function(elem){ jQuery(elem).text($2) } }' )
                                    .replace(/hide:(.*?),|hide:(.*?)\}$/g,'"hide":function(elem){ if($1)jQuery(elem).hide();else jQuery(elem).show() }, ' ); 
            var a = Function('obj',"with(obj){return " + str+";}");
            attr = a(classObj);
           registerForChange( attr.innerText, this);
           registerForChange( attr.hide, this);
           attr.innerText && attr.innerText(this);
           attr.hide && attr.hide(this);
           $(this).click(attr.click);
        });
        element.find("input, select").each(function(){
            var temp = getValue(this.name, classObj);
            assignValue.call(this, temp[0][temp[1]] );
            if(this.type=="text"){
                $(this).on("keyup", function () {
                    if(temp[0][temp[1]] != this.value){
                        var old = temp[0][temp[1]] ;
                        temp[0][temp[1]] = this.value;
                        applyChange(temp[0], classObj, temp[1], this.value, old, this.name);
                    }
                });
            }
            else{
                $(this).on("click change",function(){
                    var newValue = this.value;
                    if(this.type == "checkbox"){
                        newValue = this.checked? this.value : undefined;
                    }
                    if(temp[0][temp[1]] != newValue){
                         var old = temp[0][temp[1]] ;
                        temp[0][temp[1]] = newValue;
                        applyChange(temp[0], classObj, temp[1], this.value, old, this.name);
                    }
                });
            }
        });

        element.find("[fm-text]").each(function(){
            var v = this.getAttribute("fm-text");
        });
    }

    function assignValue( value ){
        switch( this.type ){
            case "checkbox":
            case "radio":
            {   
                if(this.value == value+"")
                {
                    this.checked = true;
                }
                else{
                    this.checked = false;
                }
                break;
            }
            default :{
                this.value = value;
            }
        }
    }
};