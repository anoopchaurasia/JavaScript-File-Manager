fm.Package("com.home");
fm.Import("jfm.cache.Cache");
fm.Import("jfm.util.Utility");
fm.Include("jfm.util.Date");
fm.Import("jfm.html.Container");
fm.Class("Chat", "jfm.division.Division");
com.home.Chat = function() {
	var chatSer, since;

	function updateLayout() {
		$(window).ready(function() {
			var win = jQuery(window);
			win.resize(function() {
				var w = win.width(), h = win.height();
				var m = $('#container').width(700).height(h - 40)[0].resize;
				m && m(700, h - 40);
			});
			$('body').trigger('resize');
		});
	}
	Static.main = function(args) {
		updateLayout();
		new me();
	};

	function send(textarea) {
		var val = jQuery.trim(textarea.val());
		if (val == '') {
			return;
		}
		chatSer.serviceCall({
			text : val.replace(/\n/ig, "<br/>")
		}, "send", function(resp) {
			$("#rss").html(JSON.parse(resp).rss);
		});
		textarea.val("");
	}
	function activate(self) {
		self.center.reset();
		self.center.add(new Container({
			id : 'recieve'
		}));
		self.bottom
				.add(new Container(
						{
							html : '<hr style="width:90%; margin:auto"/><br><textarea></textarea><button class="Submit">Send Message</button><br><input type="checkbox">:Send on enter',
							id : "send",
							height : 100
						}));
		self.right.add(new Container({
			width : 100,
			html : ' <button class="leave">Leave</button><div id=rss></div>'
		}));
		self.bottom.el.find("textarea").keydown(function(e) {

			if (e.keyCode == 13) {
				var isChecked = (e.shiftKey && !e.ctrlKey && !e.altKey) || self.bottom.el.find("button").siblings('input')[0].checked;
				if (isChecked) {
					send(self.bottom.el.find("textarea"));
					return false;
				}
			}
		});
		self.right.el.find("button.leave").click(function() {
			chatSer.serviceCall({}, "part", function(resp) {
				location.reload();
				$("#rss").html(JSON.parse(resp).rss);
			});
		});
		self.bottom.el.find("button").click(function() {
			send(self.bottom.el.find("textarea"));
			return false;
		});
	}

	// handles another person joining chat
	function userJoin(nick, timestamp) {
		// put it in the stream
		addMessage(nick, "joined", timestamp, "join");
	}

	// handles someone leaving
	function userPart(nick, timestamp) {
		// put it in the stream
		addMessage(nick, "left", timestamp, "part");
	}

	function longPoll(data) {
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
		}, "recieve", function(resp) {
			longPoll(JSON.parse(resp));
		});
	}

	this.Chat = function() {
		base({
			id : "jfm-division",
			'class' : "bg"
		});
		since = 0;
		chatSer = Server.makeInstance("chat");
		var self = this;
		this.center.add(new Container({
			html : "<form method='post'><input /><button>Join</button></form>",
			id : "join"
		}));

		chatSer.serviceCall({}, 'userExist', function(res) {
			var num = Number(res);
			if (num === 1) {
				longPoll();
				activate(self);
			}
			else {
				self.center.el.find("#join form").submit(function() {
					var val = $(this).find("input").val();
					var space = /\s/gi.exec(val);
					if (space && space.length > 0) {
						return;
					}
					chatSer.serviceCall({
						nick : jQuery.trim(val)
					}, "join", function(resp) {
						longPoll(JSON.parse(resp));
						activate(self);
					});
					return false;
				});
			}
		});

		this.addTo('#container');

	};

	function addMessage(from, text, time, _class) {
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

		var content = '<tr>' + '  <td class="nick">' + Utility.toStaticHTML(from) + '</td>' + '  <td class="msg-text">' + Utility.toNormalHtml(text) + '</td>'
				+ '  <td class="date">' + Utility.timeString(time) + '</td>' + '</tr>';
		messageElement.html(content);

		// the log is the stream that we view
		$("#recieve").append(messageElement);
		messageElement[0].scrollIntoView();
		// always view the most recent message when it is added
	}
};
