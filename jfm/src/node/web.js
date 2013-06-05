/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
 fm.Package("");
 fm.Class("webPath");
 webPath = function (me) { 
     Static.path = {
        "template" : { 'class' : "test.Template" },
        "Home" : { 'class' :"test.Home"},
        "registration" : { 'class' :"test.Registration"},
        "post" : { 'class' : "test.Post", 'auth': true},
        "subcategory" : { 'class' : "test.SubCategory"},
        "search" : {'class':"test.Search"},
        "chat" : {'class':"test.Chat"},
        "command" : {'class':"test.Command"},
        "reader" : {'class':"test.Reader"},
        "download" : {"class" : "searchfolder.SearchFolder"},
        "aws": {"class" : "aws.FileUploader"}
    };
};
