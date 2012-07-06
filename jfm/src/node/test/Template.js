/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var fs = require('fs');
fm.Package("test");
fm.Class("Template", "Base");
test.Template = function(){
    this.getTemplate = function(req, resp, t){
        var path = process.cwd() + "/web/templates/"+req.params.data+ ".html";
        fs.readFile(path, function (err, data) {
            if (err) {
                console.log(err);
            }
            else{           
                resp.write(data);
                resp.end("\n");
            }
             console.log(new Date().getTime() - t);
        });
        
    };
    this.method = function(){/**/};
};