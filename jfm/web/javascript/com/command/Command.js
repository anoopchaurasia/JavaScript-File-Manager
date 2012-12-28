fm.Package("com.command");
fm.Import("jfm.cache.Cache");
fm.Import("jfm.util.Utility");
fm.Include("jfm.util.Date");
fm.Import("jfm.html.Container");
fm.Class("Command", "jfm.division.Division");
com.command.Command = function (base, me, Cache, Utility, Container, Division){this.setMe=function(_me){me=_me;};

	var chatSer, since;

	function updateLayout( division ) {
		$(window).ready(function( ) {
			var win = jQuery(window);
			win.resize(function( ) {
				var w = win.width(), h = win.height();
				var m = $('body').width(w).height(h)[0].resize;
				m && m(w, h);
			});
			$('body').trigger('resize');
		});
		division.addTo('body');
	}

	Static.main = function( args ) {
		new me();
	};

	this.Command = function() {
		base({
		    id : "jfm-division",
		    'class' : "bg"
		});
		updateLayout(this);
		chatSer = Server.newInstance("command");
		this.center.add(new Container({
		    html : "<form method='post'><input /><button>Join</button></form>",
		    id : "join"
		}));
		activate(me);
	};

	function send( textarea ) {
		var val = jQuery.trim(textarea.val());
		if (val == '') {
			return;
		}
		chatSer.serviceCall({
			text : val.replace(/\n/ig, "<br/>")
		}, "send", function( resp ) {
			addMessage(resp);
		});
		textarea.val("");
	}
	function activate( ) {
		me.center.reset();
		me.center.add(new Container({
			id : 'recieve'
		}));
		me.bottom.add(new Container({
		    html : '<hr style="width:90%; margin:auto"/><br><textarea style="height:20px"></textarea><br><button class="Submit">Send</button><span class="activateEnter"><input type="checkbox">:Send on enter</span>',
		    id : "send",
		    height : 100
		}));
		me.bottom.el.find("textarea").keydown(function( e ) {
			if (e.keyCode == 13) {
				var isChecked = (e.shiftKey && !e.ctrlKey && !e.altKey) || me.bottom.el.find("button").next().find("input")[0].checked;
				if (isChecked) {
					send(me.bottom.el.find("textarea"));
					return false;
				}
			}
		});
		me.bottom.el.find("button").click(function( ) {
			send(me.bottom.el.find("textarea"));
			return false;
		});
	}


	function addMessage( resp, time, _class ) {
		var messageElement = $(document.createElement("table"));
		text = resp.result.replace(Utility.urlRE, '<a target="_blank" href="$&">$&</a>');
		var content = '<tr>'
						+ '<td class="nick">' + resp.command + '</td>'
						+ '<td class="msg-text"><pre class="text"></pre><pre class="error"></pre></td>'
						+ '<td class="date">' + Utility.timeString(new Date) + '</td>'
					  + '</tr>';
		messageElement.html(content);
		messageElement.find(".msg-text pre.text").text( text );
		resp.error && messageElement.find(".msg-text pre.error").text( getError(resp.error) );
		// the log is the stream that we view
		$("#recieve").append(messageElement);
		messageElement[0].scrollIntoView();
		// always view the most recent message when it is added
	}
};

function getError (error) {
	if(typeof error !== 'object' || !error){
		return error;
	}
	switch(error.code){
	 	case 1:{
	 		return "Command not found"
	 	}
	 	default:
	 		return error.code;
	 }
}
