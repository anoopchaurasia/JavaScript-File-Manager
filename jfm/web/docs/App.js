/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
fm.Import("jfm.html.Button");
fm.Import("jfm.division.Division");
fm.Import("jfm.server.Server");
fm.Import("jfm.html.InlineEditor");
fm.Class("App");
App = function () {
    Static.main = function(){
        $(window).ready(function(){
            var win = jQuery(window);
            function resize(){
                var w = win.width(), h = win.height();
                var m = $('body').height(h)[0].resize;
                m && m(w,h);
            }
            win.resize(resize);
            resize();
        });
        var divisn = new jfm.division.Division();
        var row = "<tr>"+ 
        " <td class='name editable'>Add Data</td>"+
        "<td class='param editable'></td>"+
        "<td class='return editable'></td>"+
        "<td class='description editable'></td>"+
        "</tr>";
        function addNewRow(){
            var tbody = jQuery("#editing-part");
            tbody.append(row);
            InlineEditor.getInstance().makeEditable(tbody.find('tr:last'));
        }
    
        var top = new Container({
            height:35
        });
        var addBtn = new Button({
            'class': "addRow",
            text:'Add New Row',
            css:{
                'margin-left':'40%'
            }
        });
        addBtn.el.click(addNewRow);
    
        var saveBtn = new Button({
            'class': "addRow", 
            text:"Save",
            css:{
                'margin-left':'50px'
            }
        });
        var isChangesSaved = true;
        saveBtn.el.click(function(){
            var loc = location.pathname;
            if(loc.indexOf('.jsp') !=-1){
                loc = loc.replace('.jsp','.html');
            }else{
                loc = '/docs/index.html'
            }
            Server.getInstance('/docs').serviceCall({
                file:loc,
                data:jQuery.trim(center.el.html().replace(/visibility: visible;/gim,'').replace(/style=""/gim,""))
            }, 'save', function(){
                saveBtn.el.css("background-color",'');                
                isChangesSaved = true;
            });
        });
        InlineEditor.getInstance().editComplete = function(){
            isChangesSaved = false
            saveBtn.el.css("background-color",'red');
        };
        window.onbeforeunload = function(){
          if(!isChangesSaved){
              return "Changes are not saved!!";
          }
          
        };
        top.add(addBtn);
        top.method('css','background-color','blue');
        top.add(saveBtn);
        divisn.top.add(top);
        var center = new Container();
        center.el.html($("#container").html());
        divisn.center.add(center);
        divisn.addTo(jQuery("body"));
        divisn.left.add(new Container({width:50}));
        divisn.right.add(new Container({width:50}));
        InlineEditor.getInstance().makeEditable(center.el);
        
    }
};