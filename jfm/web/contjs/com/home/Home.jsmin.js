fm.isConcatinated=!0,fm.version=1352908462176,fm.Package("com.region"),fm.Import("jfm.html.Span"),fm.Import("jfm.html.Button"),fm.Import("com.post.Top"),fm.Import("jfm.html.Combobox"),fm.Class("Left","jfm.html.Container"),com.region.Left=function(e,t,n,r,i,s,o){this.setMe=function(e){t=e},this.Left=function(t){e({width:300,"class":"right",css:{height:"100%","background-color":"#FCF0FE"}}),this.add("<div>Create List: </div>");var n=new s([],{hintText:"Type Keywords (CTRL + SHIFT + c)",inputTabIndex:3,hideButton:!0,"class":"type-combo",ignoreNumberOfCharacters:1},function(e,t){Server.getInstance("search").serviceCall({data:e},"getRelevenceData",function(e){var n=[],r;for(var i=0,s=e.length;i<s;i++)r={k:e[i].str,v:e[i].id},n.push(r);t(n)}),t([{k:"loading.......",v:""}])});n.el.addClass("searchProduct"),this.add(n);var i=3,u=new r({tabindex:2,html:"Add","class":"add-category green-btn"}),a=this;u.el.click(function(){return a.add(i,new o({html:"<span>"+n.getSelected().key+'</span><img style="width:20px; float:right;margin-right: 16px; height:20px" src="/img/wrong_answer.gif" />'})),i++,console.log(n.getSelected()),!1}),this.el.click(function(e){e.target.nodeName=="IMG"&&(jQuery(e.target).parents("div:first").remove(),i--)}),this.add(u)}},fm.Package("com.home"),fm.Import("com.region.Left"),fm.Import("jfm.cache.Cache"),fm.Import("jfm.html.form.Text"),fm.Import("jfm.server.Server"),fm.Class("Home","jfm.html.Container"),com.home.Home=function(e,t,n,r,i,s,o){this.setMe=function(e){t=e},Static.main=function(e){this.onHashChange(e[0],e[1])},Static.onHashChange=function(e,n){new t(e,n)},this.Home=function(t,r){e({width:"100%",height:"100%"});var i=new n;t.left.reset().add(i),t.center.reset().add(this)}},fm.isConcatinated=!1