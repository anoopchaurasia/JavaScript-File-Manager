
fm.Package("com.reader.taskbar");
fm.Import("jfm.html.Popup");
fm.Import("com.reader.snippet.AllSnippets");
fm.Import("com.reader.article.ArticleManager");
fm.Class("Taskbar", "jfm.html.Container");
com.reader.taskbar.Taskbar = function (base, me, Popup, AllSnippets, ArticleManager, Container){this.setMe=function(_me){me=_me;};
	var self;
	var callback, singleton;
	
	Static.getInstance = function(cb){
		if(!singleton){
			singleton = new me(cb);
		}
		return singleton;
	};
	
	Private.Taskbar = function(cb) {
		callback = cb;
		self = this;
		base(jQuery("#taskbar"));
		$(".controlers .plus", this.el).click(increaseFontSize);
		$(".controlers .minus", this.el).click(decreaseFontSize);
		
		$(".home a", this.el).click(function(){
			self.clickHome();
			return false;
		});
		
		ArticleManager.getInstance().registerChange(columnChange);
		$(".show-column a", this.el).click(function() {
			self.showOnlyColumn();
			return false;
		});
		
		$(">.news-feed-select a", this.el).click(changeSettings);   
		var popup = Popup.getInstance();
		var cont = popup.pBody( $("#setting-temp").html() );
		getData( cont.find("form.news") );
		popup.hide();
	};
	function increaseFontSize(){
		if( ArticleManager.getInstance().isActive()){
    		var f_size = parseInt( $("#article-container").css("font-size")) + 2;
	    	$("#article-container").css("font-size",  f_size);
	    	ArticleManager.getInstance().create( f_size, true );
		}
		if( AllSnippets.getInstance().isActive()){
			var f_size = parseInt( $("#article-list").css("font-size")) + 2;
	    	$("#article-list").css("font-size",  f_size);
	    	AllSnippets.getInstance().resize(   f_size );
		}
		return false;
	}
	function decreaseFontSize(){
    	if( ArticleManager.getInstance().isActive()){
	    	var f_size = parseInt( $("#article-container").css("font-size")) - 2;
	    	$("#article-container").css("font-size", f_size );
	    	ArticleManager.getInstance().create( f_size, true );
    	}
    	if(AllSnippets.getInstance().isActive()){
    		var f_size = parseInt( $("#article-list").css("font-size")) - 2;
	    	$("#article-list").css("font-size",  f_size);
	    	AllSnippets.getInstance().resize(   f_size );
    	} return false;
    }
	this.register = function() {
		
	};
	
	function createTabbing( cont) {
		var leftPanel = $(".left-panel",cont);
		var rightPanel = $(".right-panel", cont);
		var tabBody = rightPanel.find(".tab-body");
		var tabs = leftPanel.find(".tab-head");
		tabs.click(function(){
			var href = $("a",this).get(0).href;
			href= href.substring(href.indexOf("#")+1);
			tabBody.hide();
			tabBody.filter(function() {
				 if($(this).hasClass(href)){ return this; };
			}).show();
			return false;
		});
	}
	function changeSettings() {
    	//$taskbar.find(".settings-content").show();
    	var popup = new Popup();
    	var cont = popup.pBody( $("#setting-temp").html() );
    	createTabbing( cont );
    	if($("#icp_background").length == 0 ){
    		iColorPicker();
    	}
    	popup.makeItMiddle( 0, -50);
    	cont.find("form.news").submit(function() {
    		getData( this );
    		$("#setting-temp").html(cont.parent().html());
    		popup.hide();
		    return false;
		});
    	cont.find("form.color").submit(function() {
    		$("body").css({ "color" : this.color.value, "background-color" : this.background.value });
    		$("#setting-temp").html(cont.parent().html());
    		popup.hide();
		    return false;
		});
    }
	
	function getData( form ) {
   	 var arr = $( form ).serializeArray();
   	AllSnippets.getInstance().clearStoredData();
    	for(var k in arr ){
    		parseRSS( arr[k].value, callback, true);
    	}
     }       
	
	function columnChange() {
		if(!popup){
			return;
		}
		var cont = popup.pBody( ArticleManager.getInstance().getSelectedColumn() );
		cont.css('font-size', ArticleManager.getInstance().getSelectedFontSize());
		popup.makeItMiddle(0,-40);
	}
	var popup;
	this.showOnlyColumn = function()
	{
		popup = Popup.getInstance(function(){	popup = undefined;
		});
		var cont = popup.pBody( ArticleManager.getInstance().getSelectedColumn() );
		cont.css('font-size', ArticleManager.getInstance().getSelectedFontSize());
		popup.addBGClass("blackBG");
		popup.addClass("whiteBG");
		popup.makeItMiddle(0,-40);
	};
    this.clickHome = function() {
    	if(!AllSnippets.getInstance().isActive()){
    		AllSnippets.getInstance().active();
	    	ArticleManager.getInstance().deActive();
	    	if(popup){
	    		popup.hide();
	    		popup = undefined;
	    	}
    	}
    	
	};
};