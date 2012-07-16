/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
fm.Import("const.Constants");
fm.Import("user.User");
fm.Class("App");
App = function(){
    var http, url, qs, servletObj, staticServer;
    
    this.init = function(){
        fm.Include('web');
        http = require('http');
        url = require('url'),
        qs = require('querystring');
        servletObj = {};       
        console.log(__dirname);
        staticServer = new(require('node-static').Server)(undefined, {
            cache: 60,
            headers: {
                'X-Powered-By': 'node-static'
            }
        });
    };
    
    function loadServlet(path, key){
        fm.Include(path);
        servletObj[key] = new (fm.stringToObject(path))();
    }
    
    Static.main = function(args){
        http.createServer(function (req, resp) {
            var t= new Date().getTime();
            var servletName = req.url;
            if(servletName.indexOf("?") != -1){
                servletName= servletName.substring(0, servletName.indexOf("?"));
            }
            
            if(webPath[servletName] && !servletObj[servletName]){
                loadServlet(webPath[servletName], servletName);
            }
            if(servletObj[servletName]){                
                if(req.method=="POST"){                    
                    var body = "";  
                    req.on('data', function (data) {
                        body +=data;
                    });
                    req.on('end',function(){
                        req.params = qs.parse(body);
                        try{
                            
                            servletObj[servletName].POST(req, resp, t);
                           
                        }catch(e){
                        	console.log(e);
                            resp.write(JSON.parse(e));
                            resp.end();
                        }
                    });
                }
                else if (req.method == "GET"){
                    var url_parts = url.parse(servletName, true);
                    var query = url_parts.query;
                    req.params = query;
                    try{
                        servletObj[servletName].GET(req, resp, t);
                    }catch(e){
                        resp.write(JSON.parse(e));
                        resp.end();
                    }
                }
            }
            else{
                if(servletName =="/"){
                    req.url = "/index.html";
                }
                 req.url = "/web" +  req.url;
                staticServer.serve(req, resp, function(err, result) {
                    if (err) {
                        console.error('Error serving %s - %s', req.url, err.message);
                        resp.end();
                    }                    
                });               
            }
            // console.log(new Date().getTime() - t, servletName);
        }).listen(Constants.port);
    };
};