fm.isConcatinated=!0,fm.version=1352908462176,Date.prototype.toRelativeTime=function(e){var t=new Date-this;e=parseInt(e,10),isNaN(e)&&(e=0);if(t<=e)return"Just now";var n=null,r={millisecond:1,second:1e3,minute:60,hour:60,day:24,month:30,year:12};for(var i in r){if(t<r[i])break;n=i,t/=r[i]}return t=Math.floor(t),t!==1&&(n+="s"),[t,n].join(" ")},Date.fromString=function(e){return new Date(Date.parse(e))},fm.Package("jfm.util"),fm.Class("Utility"),jfm.util.Utility=function(e){function n(e){return isNaN(e)?"00":t[(e-e%16)/16]+t[e%16]}this.setMe=function(t){e=t};var t=new Array("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f");this.Static={urlRE:/https?:\/\/([-\w\.]+)+(:\d+)?(\/([^\s]*(\?\S+)?)?)?/g,toStaticHTML:function(e){return e=e.toString(),e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")},toNormalHtml:function(e){return e=e.toString(),e.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">")},zeroPad:function(e,t){t=t.toString();while(t.length<e)t="0"+t;return t},timeString:function(e){var t=e.getMinutes().toString(),n=e.getHours().toString();return this.zeroPad(2,n)+":"+this.zeroPad(2,t)},isBlank:function(e){var t=/^\s*$/;return e.match(t)!==null},rgb2Hex:function(e){return rgb=rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/),"#"+n(rgb[1])+n(rgb[2])+n(rgb[3])}}},fm.Package("com.chat"),fm.Import("jfm.cache.Cache"),fm.Import("jfm.util.Utility"),fm.Include("jfm.util.Date"),fm.Import("jfm.html.Container"),fm.Class("Chat","jfm.division.Division"),com.chat.Chat=function(e,t,n,r,i,s){function a(){var e=new s;return $(window).ready(function(){var e=jQuery(window);e.resize(function(){var t=e.width(),n=e.height(),r=$("body").width(t).height(n)[0].resize;r&&r(t,n)}),$("body").trigger("resize")}),e.addTo("body"),e}function f(e){var t=jQuery.trim(e.val());if(t=="")return;o.serviceCall({text:t.replace(/\n/ig,"<br/>")},"send",function(e){$("#rss").html(e.rss)}),e.val("")}function l(e){e.center.reset(),e.center.add(new i({id:"recieve"})),e.bottom.add(new i({html:'<hr style="width:90%; margin:auto"/><br><textarea></textarea><button class="Submit">Send</button><span class="activateEnter"><input type="checkbox">:Send on enter</span>',id:"send",height:100})),e.right.add(new i({width:100,html:' <button class="leave">Leave</button><div id=rss></div>'})),e.bottom.el.find("textarea").keydown(function(t){if(t.keyCode==13){var n=t.shiftKey&&!t.ctrlKey&&!t.altKey||e.bottom.el.find("button").next().find("input")[0].checked;if(n)return f(e.bottom.el.find("textarea")),!1}}),e.right.el.find("button.leave").click(function(){o.serviceCall({},"part",function(e){location.reload(),$("#rss").html(e.rss)})}),e.bottom.el.find("button").click(function(){return f(e.bottom.el.find("textarea")),!1})}function c(e,t){d(e,"joined",t,"join")}function h(e,t){d(e,"left",t,"part")}function p(e){e&&e.rss&&$("#rss").html(e.rss);if(e&&e.messages)for(var t=0;t<e.messages.length;t++){var n=e.messages[t];n.timestamp>u&&(u=n.timestamp);switch(n.type){case"msg":d(n.nick,n.text,n.timestamp);break;case"join":c(n.nick,n.timestamp);break;case"part":h(n.nick,n.timestamp)}}o.serviceCall({since:u},"recieve",function(e){p(e)})}function d(e,t,n,i){if(t===null)return;n==null?n=new Date:n instanceof Date==0&&(n=new Date(n));var s=$(document.createElement("table"));s.addClass("message"),i&&s.addClass(i),t=r.toStaticHTML(t),t=t.replace(r.urlRE,'<a target="_blank" href="$&">$&</a>');var o='<tr>  <td class="nick">'+r.toStaticHTML(e)+"</td>"+'  <td class="msg-text">'+r.toNormalHtml(t)+"</td>"+'  <td class="date">'+r.timeString(n)+"</td>"+"</tr>";s.html(o),$("#recieve").append(s),s[0].scrollIntoView()}this.setMe=function(e){t=e};var o,u;Static.main=function(e){var n=a();new t(n)},this.Chat=function(t){e({id:"jfm-division","class":"bg"}),u=0,o=Server.newInstance("chat");var n=this;this.center.add(new i({html:"<form method='post'><input /><button>Join</button></form>",id:"join"})),o.serviceCall({},"userExist",function(e){var t=Number(e);t===1?(p(),l(n)):n.center.el.find("#join form").submit(function(){var e=$(this).find("input").val(),t=/\s/gi.exec(e);if(t&&t.length>0)return;return o.serviceCall({nick:jQuery.trim(e)},"join",function(e){p(e),l(n)}),!1})}),t.left.add(new i({width:300,height:"100%"})),t.right.add(new i({width:300,height:"100%"})),this.addTo(t.center)}},fm.isConcatinated=!1