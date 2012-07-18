/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var chars = {"A":"B","B":"C","C":"D","D":"E","E":"F","F":"G","G":"H","H":"I","I":"J","J":"K","K":"L","L":"M","M":"N","N":"O","O":"P","P":"Q","Q":"R","R":"S","S":"T","T":"U","U":"V","V":"W","W":"X","X":"Y","Y":"Z","Z":"A"};var a = [];
function getData(index){ 
    docHead = document.getElementsByTagName("head")[0];
    var e = document.createElement("script");
    e.src = 'http://localhost:8084/javascript/jquery.js';
    e.type = "text/javascript";
    docHead.appendChild(e);
    tds = document.getElementsByTagName('td');
    for(var k=0; k<tds.length;k +=8){
        a.push(tds[k].innerText)
    }
    setTimeout(function(){
        try{
            $.ajax({
                url:"http://localhost:8084/docs",
                dataType:'jsonp',
                data:{
                    name:'Bihar',
                    method:'saveLocations',
                    data:'"'+a.join('","')+'",'
                },
                success:function(){                
                    var x= location.href.substr(-1);
                    location = location.href.substring(0,location.href.length-1)+ chars[x];
                },
                error:function(e){
                    var x= location.href.substr(-1);
                    location = location.href.substring(0,location.href.length-1)+ chars[x];
                }
            });
        }catch(e){
            var x= location.href.substr(-1);
            location = location.href.substring(0,location.href.length-1)+ chars[x];
        }
    }, 10);

    {
        var x= location.href.substr(-1);
        location = location.href.substring(0,location.href.length-1)+ chars[x];
    }
}
getData(); 









-----------------------------------

self.el.find("form#join").submit(function( ) {
	var data;
	try {
		data = FormManager.getData(this);
	}
	catch (e) {
		alert(e);
		return false;
	}
	Server.getInstance("Home").serviceCall(data, 'join', function( resp ) {
		alert(Serialize.serialize(resp));
	});
	return false;
});


---------------------