
fm.isConcatinated = true; 
 fm.version=1352908462176;
Date.prototype.toRelativeTime = function( now_threshold ) {
	var delta = new Date() - this;
	
	now_threshold = parseInt(now_threshold, 10);
	
	if (isNaN(now_threshold)) {
		now_threshold = 0;
	}
	
	if (delta <= now_threshold) {
		return 'Just now';
	}
	
	var units = null;
	var conversions = {
	    millisecond : 1, // ms -> ms
	    second : 1000, // ms -> sec
	    minute : 60, // sec -> min
	    hour : 60, // min -> hour
	    day : 24, // hour -> day
	    month : 30, // day -> month (roughly)
	    year : 12
	// month -> year
	};
	
	for ( var key in conversions) {
		if (delta < conversions[key]) {
			break;
		}
		else {
			units = key; // keeps track of the selected key over the
							// iteration
			delta = delta / conversions[key];
		}
	}
	
	// pluralize a unit when the difference is greater than 1.
	delta = Math.floor(delta);
	if (delta !== 1) {
		units += "s";
	}
	return [ delta, units ].join(" ");
};

/*
 * Wraps up a common pattern used with this plugin whereby you take a String
 * representation of a Date, and want back a date object.
 */
Date.fromString = function( str ) {
	return new Date(Date.parse(str));
};






fm.Package("jfm.util");
fm.Class("Utility");
jfm.util.Utility = function (me) {
	this.setMe = function( _me ) {
		me = _me;
	};
	var hexDigits = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f");
	
	this.Static = {
	    urlRE : /https?:\/\/([-\w\.]+)+(:\d+)?(\/([^\s]*(\?\S+)?)?)?/g,
	    
	    // html sanitizer
	    toStaticHTML : function( inputHtml ) {
		    inputHtml = inputHtml.toString();
		    return inputHtml.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	    },
	    toNormalHtml : function( inputHtml ) {
		    inputHtml = inputHtml.toString();
		    return inputHtml.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
	    },
	    
	    // pads n with zeros on the left,
	    // digits is minimum length of output
	    // zeroPad(3, 5); returns "005"
	    // zeroPad(2, 500); returns "500"
	    zeroPad : function( digits, n ) {
		    n = n.toString();
		    while (n.length < digits)
			    n = '0' + n;
		    return n;
	    },
	    
	    // it is almost 8 o'clock PM here
	    // timeString(new Date); returns "19:49"
	    timeString : function( date ) {
		    var minutes = date.getMinutes().toString();
		    var hours = date.getHours().toString();
		    return this.zeroPad(2, hours) + ":" + this.zeroPad(2, minutes);
	    },
	    
	    // does the argument only contain whitespace?
	    isBlank : function( text ) {
		    var blank = /^\s*$/;
		    return (text.match(blank) !== null);
	    },
	    
	    rgb2Hex : function( rgb2hex ) {
		    // Function to convert hex format to a rgb color
		    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
		    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
	    }
	};
	
	function hex( x ) {
		return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
	}
};
fm.Package("com.chat");
fm.Import("jfm.cache.Cache");
fm.Import("jfm.util.Utility");
fm.Include("jfm.util.Date");
fm.Import("jfm.html.Container");
fm.Class("Chat", "jfm.division.Division");
com.chat.Chat = function (base, me, Cache, Utility, Container, Division){this.setMe=function(_me){me=_me;};

	var chatSer, since;
	
	function updateLayout( ) {
		var division = new Division();
		
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
		return division;
	}
	
	Static.main = function( args ) {
		var division = updateLayout();
		new me(division);
	};
	
	this.Chat = function(division) {
		base({
		    id : "jfm-division",
		    'class' : "bg"
		});
		since = 0;
		chatSer = Server.newInstance("chat");
		var self = this;
		this.center.add(new Container({
		    html : "<form method='post'><input /><button>Join</button></form>",
		    id : "join"
		}));
		
		chatSer.serviceCall({}, 'userExist', function( res ) {
			var num = Number(res);
			if (num === 1) {
				longPoll();
				activate(self);
			}
			else {
				self.center.el.find("#join form").submit(function( ) {
					var val = $(this).find("input").val();
					var space = /\s/gi.exec(val);
					if (space && space.length > 0) {
						return;
					}
					chatSer.serviceCall({
						nick : jQuery.trim(val)
					}, "join", function( resp ) {
						longPoll(resp);
						activate(self);
					});
					return false;
				});
			}
		});
		division.left.add(new Container({width:300, height:"100%"}));
		division.right.add(new Container({width:300, height:"100%"}));
		this.addTo(division.center);
	};
	
	function send( textarea ) {
		var val = jQuery.trim(textarea.val());
		if (val == '') {
			return;
		}
		chatSer.serviceCall({
			text : val.replace(/\n/ig, "<br/>")
		}, "send", function( resp ) {
			$("#rss").html(resp.rss);
		});
		textarea.val("");
	}
	function activate( self ) {
		self.center.reset();
		self.center.add(new Container({
			id : 'recieve'
		}));
		self.bottom.add(new Container({
		    html : '<hr style="width:90%; margin:auto"/><br><textarea></textarea><button class="Submit">Send</button><span class="activateEnter"><input type="checkbox">:Send on enter</span>',
		    id : "send",
		    height : 100
		}));
		self.right.add(new Container({
		    width : 100,
		    html : ' <button class="leave">Leave</button><div id=rss></div>'
		}));
		self.bottom.el.find("textarea").keydown(function( e ) {
			
			if (e.keyCode == 13) {
				var isChecked = (e.shiftKey && !e.ctrlKey && !e.altKey) || self.bottom.el.find("button").next().find("input")[0].checked;
				if (isChecked) {
					send(self.bottom.el.find("textarea"));
					return false;
				}
			}
		});
		self.right.el.find("button.leave").click(function( ) {
			chatSer.serviceCall({}, "part", function( resp ) {
				location.reload();
				$("#rss").html(resp.rss);
			});
		});
		self.bottom.el.find("button").click(function( ) {
			send(self.bottom.el.find("textarea"));
			return false;
		});
	}
	
	// handles another person joining chat
	function userJoin( nick, timestamp ) {
		// put it in the stream
		addMessage(nick, "joined", timestamp, "join");
	}
	
	// handles someone leaving
	function userPart( nick, timestamp ) {
		// put it in the stream
		addMessage(nick, "left", timestamp, "part");
	}
	
	function longPoll( data ) {
		// if (transmission_errors > 2) {
		// showConnect();
		// return;
		// }
		
		if (data && data.rss) {
			$("#rss").html(data.rss);
			// updateRSS();
		}
		
		// process any updates we may have
		// data will be null on the first call of longPoll
		if (data && data.messages) {
			for ( var i = 0; i < data.messages.length; i++) {
				var message = data.messages[i];
				
				// track oldest message so we only request newer messages from
				// server
				if (message.timestamp > since)
					since = message.timestamp;
				
				// dispatch new messages to their appropriate handlers
				switch (message.type) {
					case "msg":
						// if(!CONFIG.focus){
						// CONFIG.unread++;
						// }
						addMessage(message.nick, message.text, message.timestamp);
						break;
					
					case "join":
						userJoin(message.nick, message.timestamp);
						break;
					
					case "part":
						userPart(message.nick, message.timestamp);
						break;
				}
			}
			// update the document title to include unread message count if
			// blurred
			// updateTitle();
			
			// only after the first request for messages do we want to show who
			// is here
			// if (first_poll) {
			// first_poll = false;
			// who();
			// }
		}
		
		// make another request
		chatSer.serviceCall({
			since : since
		}, "recieve", function( resp ) {
			longPoll(resp);
		});
	}
	
	function addMessage( from, text, time, _class ) {
		if (text === null)
			return;
		
		if (time == null) {
			// if the time is null or undefined, use the current time.
			time = new Date();
		}
		else if ((time instanceof Date) === false) {
			// if it's a timestamp, interpret it
			time = new Date(time);
		}
		
		// every message you see is actually a table with 3 cols:
		// the time,
		// the person who caused the event,
		// and the content
		var messageElement = $(document.createElement("table"));
		
		messageElement.addClass("message");
		if (_class)
			messageElement.addClass(_class);
		
		// sanitize
		text = Utility.toStaticHTML(text);
		
		// If the current user said this, add a special css class
		// var nick_re = new RegExp(CONFIG.nick);
		// if (nick_re.exec(text))
		// messageElement.addClass("personal");
		
		// replace URLs with links
		text = text.replace(Utility.urlRE, '<a target="_blank" href="$&">$&</a>');
		
		var content = '<tr>' + '  <td class="nick">' + Utility.toStaticHTML(from) + '</td>' + '  <td class="msg-text">' + Utility.toNormalHtml(text) + '</td>' + '  <td class="date">'
		        + Utility.timeString(time) + '</td>' + '</tr>';
		messageElement.html(content);
		
		// the log is the stream that we view
		$("#recieve").append(messageElement);
		messageElement[0].scrollIntoView();
		// always view the most recent message when it is added
	}
};


;

 fm.isConcatinated = false;
