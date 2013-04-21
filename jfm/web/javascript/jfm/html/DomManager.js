/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
fm.Package("jfm.html");
fm.AbstractClass("DomManager", "jfm.component.Component");
jfm.html.DomManager = function (base, me){this.setMe=function(_me){me=_me;};

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
         str = str.replace(/\s/g,"").split(".");
         var v = obj;
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

    function createRelation (type, code, classObj, elem) {
        switch(type){
            case 'click': {
                return function(){ Function('obj', "with(obj){ return "+code+";}")(classObj) };
            }
            case 'hide': {
                return function(elem){ Function('obj', 'elem', "with(obj){ if("+code+"){jQuery(elem).hide()}else{jQuery(elem).show()};}")(classObj, elem) };
            }
            case 'text': {
                return function(elem){ Function('obj', 'elem', "with(obj){ jQuery(elem).text("+ code +")}")(classObj, elem) };
            }
            case 'option': {
                code = (code+"}").replace(/\}$/,"html +='<option value='+value+'>'+text+'</option>'}" );
                return function(elem){ Function('obj', 'elem', "with(obj){var html='', k, value, text; "+ code +"}; $(elem).html(html);")(classObj, elem) };
            }
            case 'repeat':{
                code= code+"{ html +='"+elem.innerHTML.replace(/\n|\s\s/g,"").replace(/\{\{/g, "'+(").replace(/\}\}/g,")+'") + "'}";
                return function(elem){ Function('obj', 'elem', "with(obj){var html='', k; "+ code +"}; $(elem).html(html); new jfm.html.LoopScope(elem, obj)")(classObj, elem); };

            }
        }
    }

    this.dataUpdated = function (argument) {
        changed();
        me.el.find("input, select").each(function(){
            var temp = getValue(this.name, me.getSub());
            assignValue.call(this, temp[0][temp[1]] );
        });
    };

    this.DomManager = function(element, classObj){
        if(!element){
            var classObj = this.getSub();
            var name = classObj.getClass().toString();
            element = jQuery("[fm-controller='" + name + "']");
        }
        base(element);
        element.find("[fm-]").each(function(){
            var str= this.getAttribute('fm-')
                                    .replace(/^{|}$/g,"");
            var a = str.split(":");
            var obj = {}, key=a[0].replace(/\s/g,"");
            for(var k =1; k < a.length - 1; k +=1){
                obj[key]= createRelation(key, a[k].substring(0, a[k].lastIndexOf(",")), classObj, this);
                key = a[k].substring( a[k].lastIndexOf(",")+1, a[k].length).replace(/\s/g,"");
            }
            obj[key]=createRelation(key, a[k], classObj, this);
           registerForChange( obj.text, this);
           registerForChange( obj.hide, this);
           obj.text && obj.text(this);
           obj.option && obj.option(this);
            registerForChange( obj.repeat, this);
           obj.repeat && obj.repeat(this);
           obj.hide && obj.hide(this);
           $(this).click(obj.click);
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