fm.Package("com.home");
fm.Import("jfm.cache.Cache");
fm.Include("jfm.util.Date");
fm.Class("Chat", "jfm.html.Container");
com.home.Chat = function( ) {
	var chatSer, since;
	Static.main = function( args ) {
		new me();
	};
	
	function bindEvents( self ) {
		self.el.find("#send button").click(function( ) {
			chatSer.serviceCall({
				text : $(this).prev().val().replace("\n", "")
			}, "send", function( resp ) {
				$("#rss").html(JSON.parse(resp).rss);
			});
			$(this).prev().val("");
		});
		
		self.el.find("#beforeJoin button").click(function( ) {
			chatSer.serviceCall({
				nick : $(this).prev().val().trim()
			}, "join", function( resp ) {
				longPoll(JSON.parse(resp));
				self.el.find("#beforeJoin").hide();
				self.el.find("#afterJoin").show();
			});
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
			rss = data.rss;
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
			longPoll(JSON.parse(resp));
		});
	}
	
	this.Chat = function( ) {
		base();
		since = 0;
		chatSer = Server.makeInstance("chat");
		var self = this;
		Cache.getInstance().getTemplate("chat", function( resp ) {
			self.el.html(resp);
			bindEvents(self);
		});
		
		$('body').append(this.el);
		
	};
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
		text = util.toStaticHTML(text);
		
		// If the current user said this, add a special css class
		// var nick_re = new RegExp(CONFIG.nick);
		// if (nick_re.exec(text))
		// messageElement.addClass("personal");
		
		// replace URLs with links
		text = text.replace(util.urlRE, '<a target="_blank" href="$&">$&</a>');
		
		var content = '<tr>' + '  <td class="date">' + util.timeString(time) + '</td>' + '  <td class="nick">' + util.toStaticHTML(from) + '</td>' + '  <td class="msg-text">' + text + '</td>'
		        + '</tr>';
		messageElement.html(content);
		
		// the log is the stream that we view
		$("#recieve").append(messageElement);
		
		// always view the most recent message when it is added
		// scrollDown();
	}
};

var util = {
    urlRE : /https?:\/\/([-\w\.]+)+(:\d+)?(\/([^\s]*(\?\S+)?)?)?/g,
    
    // html sanitizer
    toStaticHTML : function( inputHtml ) {
	    inputHtml = inputHtml.toString();
	    return inputHtml.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
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
    }
};
