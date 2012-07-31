/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
fm.Package("jfm.html");
fm.Class("FormManager");
jfm.html.FormManager = function (me){this.setMe=function(_me){me=_me;};

    this.shortHand ="FormManager";
    
    function hasElem( o ){
        for(var t in o ){
            if( o.hasOwnProperty( t ) ){
                return true;
            }
        }
        return false;         
    }
    function getProperData(str){
        if( str == 'false'){
            return false;
        }
        else if( str == 'true' ){
            return true;
        }
        return str;
    }
    
    function convertStringToObject() {
        var a = arguments, o = null, j, d;
        d = ("" + a[1]).split(".");
        o = a[0];
        for (j = 0; j < d.length - 1; j = j + 1) {
            if( !isNaN(d[ j + 1 ]) &&  !hasElem( o ) ){
                o[d[j]] = o[d[j]] || [];
            }else{
                o[d[j]] = o[d[j]] || {};
            }
            o = o[d[j]];
        }
        o[ d[ j ] ] = getProperData(a[ 2 ]);
    }
    
    function isAddable(){
        return this.name && !this.disabled;
    }

    function isConditionMet( value , hintText){
        
        var isMandatory = this.className.indexOf("mandatory") != -1;
        if(this.jfm && typeof this.jfm.verify == 'function'){
            this.jfm.verify(value);
        }
        if(isMandatory){
            if( value !== "" && value !== hintText ){
                return true;
            }
            else{
                return false;
            }
        }
        
        return true;
    }
    
    function getAttribute(){
        return 
    }

    function getData( elem, callback){
        if( !isAddable.call( elem ) ){
            return ;
        }
     
        var value = elem.value;
        var hintText = elem.getAttribute("hintText");
        if( !isConditionMet.call( elem, value, hintText ) ){
            throw "Mandatory fields can not be empty";
        }
        if(value == hintText){
            value= "";
        }
        convertStringToObject( this, elem.name,   value );
        callback.call( elem, value, elem.type, elem.name );
    }
    
    this.Static.getData = function (self, cb) {
        var callback = typeof cb == "function" ? cb : function () { },
        ret = {};       
        for ( var i = 0, len = self.length; i < len; i++ ) {
            getData.call( ret, self[i], callback);
        }       
        return ret;
    };
    
    function assignValue( value ){
        switch( this.type ){
            case "checkbox":{
                this.checked = value;
                break;
            }
            case undefined :{
                if( typeof this  == "object" ){
                    for ( var key = 0; key < this.length; key++) {
                        if(this[key].value == (value+"")){
                            this[key].checked = true;                              
                        }else{
                            this[key].checked = false; 
                        }
                    }
                }
                break;
            }
            default :{
                this.value = value;
            }
        }
    }
    
    function setData( field, index ) {
        switch( typeof field ){
            case "object":{
                for ( var i in field) {
                    setData.call(this, field[i], index + "." + i );
                }
                break;
            }
            case "function":{
                break;
            }
            default:{
                this[index] && assignValue.call( this[index], field );
            }
        }
    }
    
    this.Static.setData = function ( self, fields, cb) {
        if (!fields){
            return;
        }
        for ( var k in fields) {
            fields.hasOwnProperty(k) && setData.call(self, fields[k], k );
        }
    };
    
    function createHtml(h, key, maxLevel, name) {
        if(maxLevel <=0 ){
            return undefined;
        }		
        var value = h[key], a = [], arr,  t, k, v;
        t = typeof value;
        switch (t) {
            case "object" :
                if(value==null){
                    return "";
                }
                break;
            case "string" :
                return "<span style='margin-left:30px;'>" + key +"</span>- <input type='text' name='" + name+ "' value='"+ value+"'/>"  ;
            case "number" :
                return "<span style='margin-left:30px;'>" + key +"</span>:- <input type='text' name='" + name +"' value='"+ value+"'/>"  ;
            case "boolean" :
                return "<span style='margin-left:30px;'>" + key +"</span>:- <span>true</span>: <input type='radio' name='" + name +  "' value='true'/> <span>false</span>: <input type='radio' name='" + name +  "' value='false'/>"  ;
            default :
                return "";
        }
        arr = value.length !== undefined && value instanceof Array ? true : false;
        var temp;
        if (arr) { // Array
            for (var i = value.length - 1; i >= 0; --i) {
                temp = createHtml(value, i, maxLevel - 1, name + "." + i);
                temp && a.push(temp);
            }
        }
        else { // Object
            a.push("<div class='collapse' style='width:600px;margin-left:30px;'>"+ ( key === "" ? name : key )+":</br>"); 
            for (k in value) {
                if (value.hasOwnProperty(k)) {
                    
                    v = createHtml(value, k, maxLevel - 1,  name + "." + k);
                    if (v) {
                        a.push(  v );
                        a.push("</br>");
                    }
                }
            }
            
            a.push("</div>");
            
        }
        return  a.join("") ;
    }

    this.Static.createHtml = function(obj){
        var prop = {};
        prop[""] = obj;
        return createHtml(prop, "", 1000, "config" );
    };
};



