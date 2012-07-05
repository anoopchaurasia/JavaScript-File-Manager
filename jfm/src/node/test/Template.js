/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var fs = require('fs');
fm.Package("test");
fm.Class("Template", "Base");
test.Template = function(){
    this.getTemplate = function(req, resp, t){
        var userprofile = process.env["USERPROFILE"];
        var path = userprofile +"/SkyDrive/workspace/StructJS1/importmanager.git/trunk/web/html/"+req.params.data+ ".html";
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
    this.method = function(){};
};