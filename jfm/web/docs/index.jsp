<!DOCTYPE html>
<html>
    <head>
        <title>JFM Documentation</title>
        <link rel='stylesheet' href='../css/main.css' type="text/css"/>
        <link type="text/css" href="../css/comboBox.css" rel="stylesheet"/>
        <script type="text/javascript" src="../javascript/jquery.js" ></script>
        <script type="text/javascript" src="../javascript/jfm/Master.js" ></script>
        <script>  
            function myJsFunc(){
                if(this.href.indexOf("javascript") !=-1){
                    eval(this.href.substring(this.href.indexOf(":") + 1));
                }
              return false;  
            };
            if(location.search.indexOf("?edit=true") != -1){
                fm.basedir='/docs'
                fm.Include("App");
                fm.basedir='/javascript';                
            }
           
        </script>
        <style>
            body{
                overflow: auto;
            }
            #container{
                width:94%;
                margin:0 auto;
            }
            table{
                margin: 0 auto;
            }
            th.name, th.param, th.return{
                width: 150px;
            }
            td, th{
               
                padding: 0 3px;
            }
            td.name{
                height: 40px;
            }
            td, th{
                border:1px solid #ccc;
                border-collapse: collapse;
            }
        </style>
    </head>
    <body>
        <div id="container">
 
                <jsp:include page="index.html" ></jsp:include>

        </div>
    </body>
</html>
