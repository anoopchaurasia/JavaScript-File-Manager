/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

fm.Import("jfm.division.Division");
fm.Import("com.test.Home");
fm.Import("com.region.Topbar");
fm.Import("com.region.Center");
fm.Import("com.web.Home");
fm.Import("com.web.Registration");
fm.Class("App");
App = function () {    
    function updateLayout(){        
        $(window).ready(function(){
            var win = jQuery(window);
            win.resize(function(){
                var w = win.width(), h = win.height();
                var m = $('body').width(w).height(h)[0].resize;
                m && m(w,h);
            });
            $('body').trigger('resize');
        });
    }
    
    function querySt() {
        var hu = window.location.search.substring(1),
        gy = hu.split("&"),val, keyValue = {};
        for (var i=0;i<gy.length;i++) {
            val =  gy[i].split("=");;
            keyValue[val[0]] = val[1];
           
        }
        return keyValue;
    }
    
    Static.main = function(){
        updateLayout();
        var center;
        var t2 = new Date().getTime();
        var d = new jfm.division.Division();
        var top = new Topbar();
        var keyValue = querySt();
        if(keyValue.method == 'verify'){
            center = new com.web.Registration(keyValue.e, d.center);
        }
        else{
             center = new com.web.Home();
        }
       
        top.updateRegion();
        d.center.add(center);                
        d.top.add(top);
        d.addTo('body');
        console.log(new Date().getTime() - t, new Date().getTime() - t2);       
    }
};
