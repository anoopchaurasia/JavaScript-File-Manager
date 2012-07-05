/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

fm.Package("test");
fm.Import("const.Constants");
fm.Class("Home","Base");
test.Home = function(){
    var pg, client, email;
    function sendMail(mail, res){
        debugger;
        email.send({
            host : "mail.imaginea.com",      // smtp server hostname
            port : "25",                     // smtp server port
            domain : "mail.imaginea.com",    // domain used by client to identify itself to server
            from : "anoop.c@imaginea.com",
            to : mail,
            subject : "Mail varification...",
            body: "<a href='http://192.168.3.33:8124/?e=" + mail + "&method=verify' >Click</a>",
            authentication: "login",
            username: Constants.userName,
            password:Constants.password
        },
        function(err, result){
            if(err){
                res.write(JSON.stringify(err));
                res.end(); 
            }else{           
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                console.log(result);
                res.write(JSON.stringify(err));
                res.end(); 
            }
        });  
    };
    this.method = function(){};
    this.join = function(req, res){
        var user = JSON.parse(req.params.user);
        var userarr = [user.email, 0];
        client.query("INSERT INTO user1(email, verified) values($1, $2)",
            userarr);
        try{
            sendMail(user.email, res);
        }catch(e){
            res.write("This mail already exist!");
            res.end();
        }        
    };
    
    this.getUser = function(req, res){
        client.query("Select * from user1 where firstname='"+ req.params.name +"'", function(a, b){
            res.writeHead(200, {
                'Content-Type': 'text/json'
            });
            res.write(JSON.stringify(b.rows));
            res.end();
        });
    };
    
    this.Home = function(){
        console.log("Called ..");
        pg = require('pg');
        email = require('mailer');
        var conString = "tcp://postgres:adminadmin@localhost/postgres";   
        client = new pg.Client(conString);
        client.query("drop table user1");
        client.query("CREATE TABLE user1(firstname varchar(20), "+
            "lastname  varchar(20), companyname varchar(20), suite varchar(20),address varchar(200), phone varchar(12),"+
            "email varchar(50), verified bit, comptype integer, org varchar(100), fromwhere varchar(100))");
        client.connect();
    };
};