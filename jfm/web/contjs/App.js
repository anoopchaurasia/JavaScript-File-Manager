fm.isConcatinated = true; 
/*!
 * jQuery hashchange event - v1.3 - 7/21/2010
 * http://benalman.com/projects/jquery-hashchange-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */

// Script: jQuery hashchange event
//
// *Version: 1.3, Last updated: 7/21/2010*
// 
// Project Home - http://benalman.com/projects/jquery-hashchange-plugin/
// GitHub       - http://github.com/cowboy/jquery-hashchange/
// Source       - http://github.com/cowboy/jquery-hashchange/raw/master/jquery.ba-hashchange.js
// (Minified)   - http://github.com/cowboy/jquery-hashchange/raw/master/jquery.ba-hashchange.min.js (0.8kb gzipped)
// 
// About: License
// 
// Copyright (c) 2010 "Cowboy" Ben Alman,
// Dual licensed under the MIT and GPL licenses.
// http://benalman.com/about/license/
// 
// About: Examples
// 
// These working examples, complete with fully commented code, illustrate a few
// ways in which this plugin can be used.
// 
// hashchange event - http://benalman.com/code/projects/jquery-hashchange/examples/hashchange/
// document.domain - http://benalman.com/code/projects/jquery-hashchange/examples/document_domain/
// 
// About: Support and Testing
// 
// Information about what version or versions of jQuery this plugin has been
// tested with, what browsers it has been tested in, and where the unit tests
// reside (so you can test it yourself).
// 
// jQuery Versions - 1.2.6, 1.3.2, 1.4.1, 1.4.2
// Browsers Tested - Internet Explorer 6-8, Firefox 2-4, Chrome 5-6, Safari 3.2-5,
//                   Opera 9.6-10.60, iPhone 3.1, Android 1.6-2.2, BlackBerry 4.6-5.
// Unit Tests      - http://benalman.com/code/projects/jquery-hashchange/unit/
// 
// About: Known issues
// 
// While this jQuery hashchange event implementation is quite stable and
// robust, there are a few unfortunate browser bugs surrounding expected
// hashchange event-based behaviors, independent of any JavaScript
// window.onhashchange abstraction. See the following examples for more
// information:
// 
// Chrome: Back Button - http://benalman.com/code/projects/jquery-hashchange/examples/bug-chrome-back-button/
// Firefox: Remote XMLHttpRequest - http://benalman.com/code/projects/jquery-hashchange/examples/bug-firefox-remote-xhr/
// WebKit: Back Button in an Iframe - http://benalman.com/code/projects/jquery-hashchange/examples/bug-webkit-hash-iframe/
// Safari: Back Button from a different domain - http://benalman.com/code/projects/jquery-hashchange/examples/bug-safari-back-from-diff-domain/
// 
// Also note that should a browser natively support the window.onhashchange 
// event, but not report that it does, the fallback polling loop will be used.
// 
// About: Release History
// 
// 1.3   - (7/21/2010) Reorganized IE6/7 Iframe code to make it more
//         "removable" for mobile-only development. Added IE6/7 document.title
//         support. Attempted to make Iframe as hidden as possible by using
//         techniques from http://www.paciellogroup.com/blog/?p=604. Added 
//         support for the "shortcut" format $(window).hashchange( fn ) and
//         $(window).hashchange() like jQuery provides for built-in events.
//         Renamed jQuery.hashchangeDelay to <jQuery.fn.hashchange.delay> and
//         lowered its default value to 50. Added <jQuery.fn.hashchange.domain>
//         and <jQuery.fn.hashchange.src> properties plus document-domain.html
//         file to address access denied issues when setting document.domain in
//         IE6/7.
// 1.2   - (2/11/2010) Fixed a bug where coming back to a page using this plugin
//         from a page on another domain would cause an error in Safari 4. Also,
//         IE6/7 Iframe is now inserted after the body (this actually works),
//         which prevents the page from scrolling when the event is first bound.
//         Event can also now be bound before DOM ready, but it won't be usable
//         before then in IE6/7.
// 1.1   - (1/21/2010) Incorporated document.documentMode test to fix IE8 bug
//         where browser version is incorrectly reported as 8.0, despite
//         inclusion of the X-UA-Compatible IE=EmulateIE7 meta tag.
// 1.0   - (1/9/2010) Initial Release. Broke out the jQuery BBQ event.special
//         window.onhashchange functionality into a separate plugin for users
//         who want just the basic event & back button support, without all the
//         extra awesomeness that BBQ provides. This plugin will be included as
//         part of jQuery BBQ, but also be available separately.

(function($,window,undefined){
  '$:nomunge'; // Used by YUI compressor.
  
  // Reused string.
  var str_hashchange = 'hashchange',
    
    // Method / object references.
    doc = document,
    fake_onhashchange,
    special = $.event.special,
    
    // Does the browser support window.onhashchange? Note that IE8 running in
    // IE7 compatibility mode reports true for 'onhashchange' in window, even
    // though the event isn't supported, so also test document.documentMode.
    doc_mode = doc.documentMode,
    supports_onhashchange = 'on' + str_hashchange in window && ( doc_mode === undefined || doc_mode > 7 );
  
  // Get location.hash (or what you'd expect location.hash to be) sans any
  // leading #. Thanks for making this necessary, Firefox!
  function get_fragment( url ) {
    url = url || location.href;
    return '#' + url.replace( /^[^#]*#?(.*)$/, '$1' );
  };
  
  // Method: jQuery.fn.hashchange
  // 
  // Bind a handler to the window.onhashchange event or trigger all bound
  // window.onhashchange event handlers. This behavior is consistent with
  // jQuery's built-in event handlers.
  // 
  // Usage:
  // 
  // > jQuery(window).hashchange( [ handler ] );
  // 
  // Arguments:
  // 
  //  handler - (Function) Optional handler to be bound to the hashchange
  //    event. This is a "shortcut" for the more verbose form:
  //    jQuery(window).bind( 'hashchange', handler ). If handler is omitted,
  //    all bound window.onhashchange event handlers will be triggered. This
  //    is a shortcut for the more verbose
  //    jQuery(window).trigger( 'hashchange' ). These forms are described in
  //    the <hashchange event> section.
  // 
  // Returns:
  // 
  //  (jQuery) The initial jQuery collection of elements.
  
  // Allow the "shortcut" format $(elem).hashchange( fn ) for binding and
  // $(elem).hashchange() for triggering, like jQuery does for built-in events.
  $.fn[ str_hashchange ] = function( fn ) {
    return fn ? this.bind( str_hashchange, fn ) : this.trigger( str_hashchange );
  };
  
  // Property: jQuery.fn.hashchange.delay
  // 
  // The numeric interval (in milliseconds) at which the <hashchange event>
  // polling loop executes. Defaults to 50.
  
  // Property: jQuery.fn.hashchange.domain
  // 
  // If you're setting document.domain in your JavaScript, and you want hash
  // history to work in IE6/7, not only must this property be set, but you must
  // also set document.domain BEFORE jQuery is loaded into the page. This
  // property is only applicable if you are supporting IE6/7 (or IE8 operating
  // in "IE7 compatibility" mode).
  // 
  // In addition, the <jQuery.fn.hashchange.src> property must be set to the
  // path of the included "document-domain.html" file, which can be renamed or
  // modified if necessary (note that the document.domain specified must be the
  // same in both your main JavaScript as well as in this file).
  // 
  // Usage:
  // 
  // jQuery.fn.hashchange.domain = document.domain;
  
  // Property: jQuery.fn.hashchange.src
  // 
  // If, for some reason, you need to specify an Iframe src file (for example,
  // when setting document.domain as in <jQuery.fn.hashchange.domain>), you can
  // do so using this property. Note that when using this property, history
  // won't be recorded in IE6/7 until the Iframe src file loads. This property
  // is only applicable if you are supporting IE6/7 (or IE8 operating in "IE7
  // compatibility" mode).
  // 
  // Usage:
  // 
  // jQuery.fn.hashchange.src = 'path/to/file.html';
  
  $.fn[ str_hashchange ].delay = 50;
  /*
  $.fn[ str_hashchange ].domain = null;
  $.fn[ str_hashchange ].src = null;
  */
  
  // Event: hashchange event
  // 
  // Fired when location.hash changes. In browsers that support it, the native
  // HTML5 window.onhashchange event is used, otherwise a polling loop is
  // initialized, running every <jQuery.fn.hashchange.delay> milliseconds to
  // see if the hash has changed. In IE6/7 (and IE8 operating in "IE7
  // compatibility" mode), a hidden Iframe is created to allow the back button
  // and hash-based history to work.
  // 
  // Usage as described in <jQuery.fn.hashchange>:
  // 
  // > // Bind an event handler.
  // > jQuery(window).hashchange( function(e) {
  // >   var hash = location.hash;
  // >   ...
  // > });
  // > 
  // > // Manually trigger the event handler.
  // > jQuery(window).hashchange();
  // 
  // A more verbose usage that allows for event namespacing:
  // 
  // > // Bind an event handler.
  // > jQuery(window).bind( 'hashchange', function(e) {
  // >   var hash = location.hash;
  // >   ...
  // > });
  // > 
  // > // Manually trigger the event handler.
  // > jQuery(window).trigger( 'hashchange' );
  // 
  // Additional Notes:
  // 
  // * The polling loop and Iframe are not created until at least one handler
  //   is actually bound to the 'hashchange' event.
  // * If you need the bound handler(s) to execute immediately, in cases where
  //   a location.hash exists on page load, via bookmark or page refresh for
  //   example, use jQuery(window).hashchange() or the more verbose 
  //   jQuery(window).trigger( 'hashchange' ).
  // * The event can be bound before DOM ready, but since it won't be usable
  //   before then in IE6/7 (due to the necessary Iframe), recommended usage is
  //   to bind it inside a DOM ready handler.
  
  // Override existing $.event.special.hashchange methods (allowing this plugin
  // to be defined after jQuery BBQ in BBQ's source code).
  special[ str_hashchange ] = $.extend( special[ str_hashchange ], {
    
    // Called only when the first 'hashchange' event is bound to window.
    setup: function() {
      // If window.onhashchange is supported natively, there's nothing to do..
      if ( supports_onhashchange ) { return false; }
      
      // Otherwise, we need to create our own. And we don't want to call this
      // until the user binds to the event, just in case they never do, since it
      // will create a polling loop and possibly even a hidden Iframe.
      $( fake_onhashchange.start );
    },
    
    // Called only when the last 'hashchange' event is unbound from window.
    teardown: function() {
      // If window.onhashchange is supported natively, there's nothing to do..
      if ( supports_onhashchange ) { return false; }
      
      // Otherwise, we need to stop ours (if possible).
      $( fake_onhashchange.stop );
    }
    
  });
  
  // fake_onhashchange does all the work of triggering the window.onhashchange
  // event for browsers that don't natively support it, including creating a
  // polling loop to watch for hash changes and in IE 6/7 creating a hidden
  // Iframe to enable back and forward.
  fake_onhashchange = (function(){
    var self = {},
      timeout_id,
      
      // Remember the initial hash so it doesn't get triggered immediately.
      last_hash = get_fragment(),
      
      fn_retval = function(val){ return val; },
      history_set = fn_retval,
      history_get = fn_retval;
    
    // Start the polling loop.
    self.start = function() {
      timeout_id || poll();
    };
    
    // Stop the polling loop.
    self.stop = function() {
      timeout_id && clearTimeout( timeout_id );
      timeout_id = undefined;
    };
    
    // This polling loop checks every $.fn.hashchange.delay milliseconds to see
    // if location.hash has changed, and triggers the 'hashchange' event on
    // window when necessary.
    function poll() {
      var hash = get_fragment(),
        history_hash = history_get( last_hash );
      
      if ( hash !== last_hash ) {
        history_set( last_hash = hash, history_hash );
        
        $(window).trigger( str_hashchange );
        
      } else if ( history_hash !== last_hash ) {
        location.href = location.href.replace( /#.*/, '' ) + history_hash;
      }
      
      timeout_id = setTimeout( poll, $.fn[ str_hashchange ].delay );
    };
    
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    // vvvvvvvvvvvvvvvvvvv REMOVE IF NOT SUPPORTING IE6/7/8 vvvvvvvvvvvvvvvvvvv
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    $.browser.msie && !supports_onhashchange && (function(){
      // Not only do IE6/7 need the "magical" Iframe treatment, but so does IE8
      // when running in "IE7 compatibility" mode.
      
      var iframe,
        iframe_src;
      
      // When the event is bound and polling starts in IE 6/7, create a hidden
      // Iframe for history handling.
      self.start = function(){
        if ( !iframe ) {
          iframe_src = $.fn[ str_hashchange ].src;
          iframe_src = iframe_src && iframe_src + get_fragment();
          
          // Create hidden Iframe. Attempt to make Iframe as hidden as possible
          // by using techniques from http://www.paciellogroup.com/blog/?p=604.
          iframe = $('<iframe tabindex="-1" title="empty"/>').hide()
            
            // When Iframe has completely loaded, initialize the history and
            // start polling.
            .one( 'load', function(){
              iframe_src || history_set( get_fragment() );
              poll();
            })
            
            // Load Iframe src if specified, otherwise nothing.
            .attr( 'src', iframe_src || 'javascript:0' )
            
            // Append Iframe after the end of the body to prevent unnecessary
            // initial page scrolling (yes, this works).
            .insertAfter( 'body' )[0].contentWindow;
          
          // Whenever `document.title` changes, update the Iframe's title to
          // prettify the back/next history menu entries. Since IE sometimes
          // errors with "Unspecified error" the very first time this is set
          // (yes, very useful) wrap this with a try/catch block.
          doc.onpropertychange = function(){
            try {
              if ( event.propertyName === 'title' ) {
                iframe.document.title = doc.title;
              }
            } catch(e) {}
          };
          
        }
      };
      
      // Override the "stop" method since an IE6/7 Iframe was created. Even
      // if there are no longer any bound event handlers, the polling loop
      // is still necessary for back/next to work at all!
      self.stop = fn_retval;
      
      // Get history by looking at the hidden Iframe's location.hash.
      history_get = function() {
        return get_fragment( iframe.location.href );
      };
      
      // Set a new history item by opening and then closing the Iframe
      // document, *then* setting its location.hash. If document.domain has
      // been set, update that as well.
      history_set = function( hash, history_hash ) {
        var iframe_doc = iframe.document,
          domain = $.fn[ str_hashchange ].domain;
        
        if ( hash !== history_hash ) {
          // Update Iframe with any initial `document.title` that might be set.
          iframe_doc.title = doc.title;
          
          // Opening the Iframe's document after it has been closed is what
          // actually adds a history entry.
          iframe_doc.open();
          
          // Set document.domain for the Iframe document as well, if necessary.
          domain && iframe_doc.write( '<script>document.domain="' + domain + '"</script>' );
          
          iframe_doc.close();
          
          // Update the Iframe's hash, for great justice.
          iframe.location.hash = hash;
        }
      };
      
    })();
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // ^^^^^^^^^^^^^^^^^^^ REMOVE IF NOT SUPPORTING IE6/7/8 ^^^^^^^^^^^^^^^^^^^
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    
    return self;
  })();
  
})(jQuery,this);






fm.Package("jfm.component");
fm.Class("Component");
jfm.component.Component = function (me){this.setMe=function(_me){me=_me;};

    
    this.shortHand = "Component";
    
    this.Component = function(){
        this.el = jQuery.apply(this, arguments);
    };

    function addAt(me, index, obj){
        obj = typeof obj =='string' ? obj : Component.isComponent(obj)? obj.el : jQuery(obj);
        var child;
        me.el.children().each(
        function( indx, o){
            if( index == indx){
                child = jQuery(o);
                return false;
            }
        });
        if(!child){
            addAtEnd(me, obj);
        }
        else{
            child.before(obj);
            obj instanceof jQuery && obj[0].jfm &&  obj[0].jfm.afterRender && obj[0].jfm.afterRender(me.el);
        }
    }
    
    function addAtEnd(me, obj){
        var o = typeof obj =='string' ? obj : Component.isComponent(obj)? obj.el : jQuery(obj);       
        me.el.append( o );
        o instanceof jQuery && o[0].jfm &&  o[0].jfm.afterRender && o[0].jfm.afterRender(me.el);
    }
    
    function createElem (obj){
        
        if(typeof obj =='string' || obj instanceof jQuery){
            return obj;
        }
        else if( obj.el instanceof jQuery){
            return obj.el;
        }
        else if(jQuery.isArray(obj)){
            return obj;
        }
        else{
            var items = obj.items,
            newItems = [],
            Class,
            defaultProp = obj.defaultProp,
            cls = defaultProp.Class;
            delete defaultProp.Class; 
            for(var k = 0; k < items.length; k++){
                Class = items[k].Class || cls;
                delete items[k].Class;
                newItems.push(new Class(jQuery.extend( {}, defaultProp, items[k])));
            }
        }
        return newItems;
    }
    
    this.add = function(index, obj){
        this.testing = 67;
        if(jQuery.isNumeric(index)){
            obj = createElem(obj);
            if(jQuery.isArray(obj)){
                for(var k = 0; k< obj.length; k++){
                    addAt(this, index, obj[k] );
                }
            }
            else{
                addAt(this, index, obj );
            }
        }
        else{
            obj = createElem(index);
            if(jQuery.isArray(obj)){
                for(var k = 0; k < obj.length; k++){
                    addAtEnd(this, obj[k]);
                }
            }
            else{
                addAtEnd(this, obj);
            }
        }
    };     
    
    this.method = function(){
        var arr = [];
        for(var k =1; k < arguments.length; k++){
            arr.push(arguments[k]);
        }
        return this.el[arguments[0]].apply(this.el, arr);
    };
    
    Static.isComponent = function(obj){
        return typeof obj.instanceOf == 'function' &&  obj.el instanceof jQuery;
    };
    
    Static.getCSSClass = function(c, cls){
        return (c? c : "" ) + " "+ cls;
    };
};


/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
fm.Package("jfm.html");
fm.Class("Container", 'jfm.component.Component');
jfm.html.Container = function (base, me, Component){this.setMe=function(_me){me=_me;};
    
    this.shortHand = "Container";
    this.Container = function(config){
        var draggable = config && config.draggable;
        if(config){
            delete config.draggable;
        }
        if(config instanceof jQuery ){
        	base(config);
        }else{
        	base( '<div />', jQuery.extend(true, {}, config) );
        }
        if(draggable){
            this.el.draggable({
                revert: true
              
            });
        }
    };

};


 
fm.Package("jfm.division");
fm.Class("Part","jfm.component.Component");
jfm.division.Part = function (base, me, Component){this.setMe=function(_me){me=_me;};

    var set, division;    
    this.Part = function(config, divsn, s){
        set = s;
        division = divsn;
        config.css = config.css || {};
        config.css.display = 'none';
        base('<div />',config);
    };
    
    this.add = function(elem){        
        set(elem);
        elem;
    };
    
    this.reset = function(){
        this.el.empty();
        this.el.css({ 'display':'none',height:0, width:0 });
        division.updateLayout();
        return this;
    };
};

fm.Package("jfm.division");
fm.Import("jfm.division.Part");
fm.Class("Division", "jfm.html.Container");
jfm.division.Division = function (base, me, Part, Container){this.setMe=function(_me){me=_me;};

	var width, height, me;
	this.addTo = function( container ) {
		var timeoutID;
		container = Component.isComponent(container) ? container.el : jQuery(container);
		me.ownerCt = container;
		container[0].resize = function( w, h ) {
			timeoutID && clearTimeout(timeoutID)
			;
			timeoutID = setTimeout(function( ) {
				width = w;
				height = h;
				me.updateLayout();
				timeoutID = 0;
			}, 300);
		};
		this.el.appendTo(container);
		width = container.width();
		height = container.height();
		this.updateLayout();
	};
	
	this.init = function( ) {
		Static.config = {
		    width : "100%",
		    height : "100%",
		    'class' : 'jfm-division'
		};
	};
	
	this.Division = function( config ) {
		me = this;
		var container = config && config.addTo;
		if (config) {
			delete config.addTo;
		}
		config = jQuery.extend({}, this.config, config);
		height = width = 0;
		base(config);
		this.top = new Part({
			'class' : "jfm-division-top"
		}, this, function( elem ) {
			set(elem, me.top, 0, 0);
		});
		this.left = new Part({
			'class' : "jfm-division-left"
		}, this, function( elem ) {
			set(elem, me.left, 0, getRemainingHeight());
		});
		this.center = new Part({
			'class' : "jfm-division-center"
		}, this, function( elem ) {
			set(elem, me.center, getRemainingWidth(), getRemainingHeight());
		});
		this.center.el.show();
		this.right = new Part({
			'class' : "jfm-division-right"
		}, this, function( elem ) {
			set(elem, me.right, 0, getRemainingHeight());
		});
		this.bottom = new Part({
			'class' : "jfm-division-bottom"
		}, this, function( elem ) {
			set(elem, me.bottom, 0, 0);
		});
		this.add([ this.top, this.left, this.center, this.right, this.bottom ]);
		if (container) {
			this.addTo(container);
		}
	};
	
	function getRemainingWidth( ) {
		var w = (me.left && me.left.el[0].offsetWidth) || 0;
		w += (me.right && me.right.el[0].offsetWidth) || 0;
		return width - w;
	}
	
	function getRemainingHeight( ) {
		var h = (me.bottom && me.bottom.el.height()) || 0;
		h += (me.top && me.top.el.height()) || 0;
		return height - h;
	}
	
	var isAlreadyset;
	this.updateLayout = function( ) {
		var h = getRemainingHeight();
		var w = getRemainingWidth();
		me.top && me.top.el.width(width);
		me.bottom && me.bottom.el.width(width);
		me.left && me.left.el.height(h);
		me.right && me.right.el.height(h);
		var m = me.center && me.center.el.height(h).width(w)[0].resize;
		m && m(w, h);
		me.center.el.css("overflow", 'hidden');
		if (isAlreadyset) {
			clearTimeout(isAlreadyset);
		}
		isAlreadyset = setTimeout(function( ) {
			isAlreadyset = 0;
			me.center.el.css("overflow", '');
		}, 800);
	};
	
	function set( obj, appender, difW, difH ) {
		if (obj && obj.instanceOf && obj.el instanceof jQuery) {
			// TODO
		}
		else {
			obj = new Container(obj);
		}
		difH && appender.el.height(difH);
		appender.el.show()
		if (difH > appender.el.height()) {
			difW = difW - 20;
		}
		difW && appender.el.width(difW);
		obj.el.appendTo(appender.el);
		!difW && appender.el.width(obj.el.width());
		!difH && appender.el.height(obj.el.height());
		me.updateLayout();
		return obj;
	}
};


fm.Package("jfm.query");
fm.Class("QueryStr");
jfm.query.QueryStr = function (me){this.setMe=function(_me){me=_me;};

	var keyValue;
	this.shortHand = "QueryStr";
	Static.main = function( ) {
		var hu = window.location.search.substring(1), gy = hu.split("&"), val;
		keyValue = {};
		for ( var i = 0; i < gy.length; i++) {
			val = gy[i].split("=");
			keyValue[val[0]] = val[1];
		}
		keyValue;
	};
	Static.getQuery = function(name){
		return keyValue[name];
	};
};


fm.Package("jfm.hash");
fm.Class("HashChange");
jfm.hash.HashChange = function (me){this.setMe=function(_me){me=_me;};
	var division;
	function onHashChange(  ) {
		var hash = location.hash.substring(1);
		switch (hash) {
			case("registration"):{
				if(fm.isExist("com.registration.Registration")){
					com.registration.Registration.onHashChange(division);
				}else{
					fm.Include("com.registration.Registration", division);
				}
				break;
			}
			case ("home"): {
				if(fm.isExist("com.home.Home")){
					com.home.Home.onHashChange(division, {});
				}else{
					fm.Include("com.home.Home",division, {});
				}
				break;
			}
			case ("chat"):{
				if(fm.isExist("com.chat.Chat")){
					com.chat.Chat.onHashChange(division, {});
				}else{
					fm.Include("com.chat.Chat",division, {});
				}
				break;
			}
			case ("register"):{
				if(fm.isExist('shop.Register') ){
		    		 shop.Register.hashChange(division);
		    	}
		    	else{
		    		fm.Include("shop.Register", division);
		    		
		    	}
				break;
			}
			default: {
				if(fm.isExist("com.home.Login")){
					com.home.Login.onHashChange(division);
				}else{
					fm.Include("com.home.Login", division);
				}
			}
			
			//location.reload();
		}
	}
	
	this.HashChange = function( d ) {
		division = d;
		console.log("a");
		jQuery(window).hashchange(onHashChange);
		if(location.hash.length < 2){
			location.hash="home";
		}
		else{
			onHashChange();
		}
	};
};


/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
fm.Package("jfm.html");
fm.Class("Span");
jfm.html.Span = function (me){this.setMe=function(_me){me=_me;};
    
    this.shortHand = "Span";
    this.init = function(){
        var config = Static.config  = {};
        config["class"] = " jfm-text";
    };
    
    this.Span = function(config){
       if( typeof config == 'string'){
            var t= config;
            config = {};
            config.text = t;
        }
        config["class"] = Component.getCSSClass(config["class"], this.config['class']);
        this.el = jQuery('<span/>' , config);
    }; 
   
};

//jfm.html.Span.prototype = jQuery.prototype;





/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
fm.Package("jfm.html");
fm.Class("Img");
jfm.html.Img = function (me){this.setMe=function(_me){me=_me;};
    
    this.shortHand = "Img";
    this.init = function(){
        var config = Static.config  = {};
        config["class"] = "jfm-icon";
    };
    
    this.Img = function(config){
        if( typeof config == 'string'){
            config = {
                src : config
            };
        }
        config["class"] = Component.getCSSClass(config['class'], this.config['class']);
        if(config.src){
            this.el = jQuery('<img/>' , config);
        }else{
            this.el = jQuery('<span/>' , config);
        }
    };
};


/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
fm.Package("jfm.html");
fm.Class("Anchor", "jfm.component.Component");
jfm.html.Anchor = function (base, me, Component){this.setMe=function(_me){me=_me;};

    this.shortHand = "Anchor";
    this.Anchor = function(config){
        if(typeof(config) == 'string'){
            config = {
                html:config
            };
        }
        var items = jfm.html.Items.getItems(config);
        base('<a/>', config);
        this.add(items);
    };
};



/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

fm.Package("jfm.html");
fm.Import("jfm.html.Span");
fm.Import("jfm.html.Img");
fm.Import("jfm.html.Anchor");
fm.Class("Items");
jfm.html.Items = function (me, Span, Img, Anchor){this.setMe=function(_me){me=_me;};

    Static.getItems = function(c){
        var items = [];
        for(var k in c){
            if(c.hasOwnProperty(k)){
                switch(k){
                    case 'text':
                    case 'html':{
                        items.push(new Span(c[k])); 
                        delete c[k];
                        break;
                    }
                    case 'icon':{
                        items.push(new Img(c[k])); 
                        delete c[k];
                        break;
                    }
                    case 'iconCls':{
                        items.push(new Img({'class':c[k]})); 
                        delete c[k];
                        break;  
                    }
                    case 'anchor':{
                        items.push(new Anchor(c[k]));
                        delete c[k];
                        break; 
                    }
                }
            }
        }
        if('items' in c){
            items.concat(c.items);
            delete c.items;
        }
        return items;
    };
};


/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
fm.Package("jfm.html");
fm.Import("jfm.html.Items");
fm.Class("Button", 'jfm.component.Component');
jfm.html.Button = function (base, me, Items, Component){this.setMe=function(_me){me=_me;};
    

    this.shortHand = "Button";
    this.init = function(){
        var c = Static.Const.config = {};
        c['class']  = "jfm-button-div jfm-button";
    };
    
    this.Button = function(config){
        var items = Items.getItems(config);
        config.html = this.config.html;
        config["class"] = Component.getCSSClass(config["class"], this.config['class']);
        base('<button/>', config);
        this.add(items);
    };
};


/**
 * Created with JetBrains WebStorm.
 * User: anoop
 * Date: 5/12/12
 * Time: 2:54 AM
 * To change this template use File | Settings | File Templates.
 */
fm.Package("jfm.lang");
fm.Class("Character");
jfm.lang.Character = function (me){this.setMe=function(_me){me=_me;};


    this.shortHand = "Character";
    Static.Const = {
        UTF_CHAR : /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        CHARS : {
            '\b' : '\\b',
            '\t' : '\\t',
            '\n' : '\\n',
            '\f' : '\\f',
            '\r' : '\\r',
            '"' : '\\"',
            '\\' : '\\\\'
        },
        rCRLF : /\r?\n/g,
        EMPTY : "",
        OPEN_O : '{',
        CLOSE_O : '}',
        OPEN_A : '[',
        CLOSE_A : ']',
        COMMA : ',',
        COMMA_CR : ",\n",
        CR : "\n",
        COLON : ':',
        COLON_SP : ': ',
        QUOTE : '"'        
    };
    Static.Const.keys = {
        BACKSPACE: 8,
        TAB: 9,
        ENTER: 13,
        SHIFT: 16,
        CTRL: 17,
        ALT: 18,
        BREAK: 19,
        CAPSLOCK: 20,
        ESCAPE: 27,
        PAGEUP: 33,
        PAGEDOWN: 34,
        END: 35,
        HOME: 36,
        LEFTARROW: 37,
        UPARROW: 38,
        RIGHTARROW: 39,
        DOWNARROW: 40,
        INSERT: 45,
        DELETE: 46,
        ZERO: 48,
        ONE: 49,
        TWO: 50,
        THREE: 51,
        FOUR: 52,
        FIVE: 53,
        SIX: 54,
        SEVEN: 55,
        EIGHT: 56,
        NINE: 57,
        A: 65,
        B: 66,
        C: 67,
        D: 68,
        E: 69,
        F: 70,
        G: 71,
        H: 72,
        I: 73,
        J: 74,
        K: 75,
        L: 76,
        M: 77,
        N: 78,
        O: 79,
        P: 80,
        Q: 81,
        R: 82,
        S: 83,
        T: 84,
        U: 85,
        V: 86,
        W: 87,
        X: 88,
        Y: 89,
        Z: 90,
        LEFT_WINDOW_KEY:91,
        RIGHT_WINDOW_KEY: 92,
        SELECT_KEY: 93,
        MULTIPLY: 106,
        ADD: 107,
        SUBTRACT: 109,
        DECIMAL_POINT: 110,
        DIVIDE: 111,
        F1: 112,
        F2: 113,
        F3: 114,
        F4: 115,
        F5: 116,
        F6: 117,
        F7: 118,
        F8: 119,
        F9: 120,
        F10: 121,
        F11: 122,
        F12: 123,
        NUM_LOCK: 144,
        SCROLLLOCK: 145,
        SEMICOLON: 186,
        EQUAL: 187,
        COMMA: 188,
        DASH: 189,
        PERIOD: 190,
        FORWARDSLASH: 191,
        GRAVEACCENT: 192,
        OPENBRACKET: 219,
        BACKSLASH: 220,
        CLOSEBRAKET: 221,
        SINGLEQUOTE: 222
    }   
};

/**
 * Created with JetBrains WebStorm.
 * User: anoop
 * Date: 5/12/12
 * Time: 2:52 AM
 * To change this template use File | Settings | File Templates.
 */
fm.Package("jfm.io");
fm.Import("jfm.lang.Character");
fm.Class("Serialize");
jfm.io.Serialize = function (me, Character){this.setMe=function(_me){me=_me;};


    this.shortHand = "Serialize";
    
    function _char(c) {

        if (!Character.CHARS[c]) {
            Character.CHARS[c] = '\\u' + ('0000' + (+(c.charCodeAt(0))).toString(16))
            .slice(-4);
        }
        return Character.CHARS[c];
    }
    function _string(s) {
        return Character.QUOTE + s.replace(Character.UTF_CHAR, _char) + Character.QUOTE;
    }
    
    function serialize(h, key, maxLevel) {
        if(maxLevel <= 0 ){
            return undefined;
        }    
        var value = h[key], a = [], arr,  t, k, v, bluePrint;
        t = typeof value;
        if(value instanceof window.jQuery){
            return null;
        }
        switch (t) {
            case "object" :
                if(value==null){
                    return undefined;
                }
                break;
            case "string" :
                return _string(value);
            case "number" :
                return isFinite(value) ? value : Character.NULL;
            case "boolean" :
                return value;
            default :
                return undefined;
        }
        arr = value.length !== undefined && value instanceof Array ? true : false;
        var temp;
        if (arr) { // Array
            for (var i = value.length - 1; i >= 0; --i) {
                temp = serialize(value, i, maxLevel - 1);
                temp && a.push(temp);
            }
        }
        else {
        
            for (k in value) {
                if (value.hasOwnProperty(k) ) {                                          
                    v = serialize(value, k, maxLevel - 1);
                    if (v) {
                        a.push( _string(k) + Character.COLON + v);
                    }
                }
            }
        }        
        return arr ? Character.OPEN_A + a.join(Character.COMMA) + Character.CLOSE_A : Character.OPEN_O + a.join(Character.COMMA) + Character.CLOSE_O;
    }
    
    this.Static.serialize = function(obj, maxLevel){
        return serialize({
            "" :obj
        }, "", maxLevel || 1000 );
    };
    Static.JavaSerialize = function(obj){
        if(obj.getClass && obj.getSerializable){
            obj = obj.getSerializable();
        }
        var newObj = {};
        if(typeof obj == 'object'){
            for(var k in obj){
                if(obj.hasOwnProperty(k)){
                    if(obj[k].getClass && obj[k].getSerializable){
                        newObj[k] = this.JavaSerialize(obj[k].getSerializable());
                    }
                    else{
                        newObj[k] = this.JavaSerialize(obj[k]);
                    }
                }
            }
        }else{
            newObj = obj;
        }
        return newObj;
    };
    this.Static.un = function __serialize__(d, cls){     
        d = typeof d == 'object' ? d : jQuery.parseJSON(d);
        var clsObj =  fm.stringToObject(cls);
        var bluePrint = jQuery.parseJSON(bluePrints[cls]) || {};
        var h = new clsObj(), s = {};
        for(var k in d){            
            if( bluePrint[k]  ){
                if(bluePrint[k].pos == "_s_"   ){
                    s[k] = bluePrint[k].type ? __serialize__(d[k], bluePrint[k].type) : d[k];
                }
                else if(bluePrint[k].type){
                    h[k] = __serialize__(d[k], bluePrint[k].type);
                }
                else{
                    h[k] = d[k];
                }
            }
            else{
                h[k] = d[k];                
            }
        }
        h.setSerializable(s);
        return h;
    };
};

/**
 * Created with JetBrains WebStorm.
 * User: anoop
 * Date: 5/12/12
 * Time: 5:42 PM
 * To change this template use File | Settings | File Templates.
 */

fm.Package("jfm.server");
fm.Import("jfm.io.Serialize");
fm.Class("Server");
jfm.server.Server = function (me, Serialize){this.setMe=function(_me){me=_me;};

    var me = this;
    this.url = location.protocol + "//" + location.host + "/" ;
    this.method = "method";
    this.shortHand = "Server";
    this.type = "json";
    this.async = true;
    this.parameters = {};
    var singleton;
    
    this.errorCallback = function(msg) {
        console.log(msg);
    };
    
    this.callback = function(msg) {
    	console.log("callback", msg);
    };
    
    this.Static.newInstance = function(url, parameters, method, cb, err, type, async){
    	return new me(url, parameters, method, cb, err, type, async);
    };
    
    this.Static.getInstance = function(url){  

		if(!singleton){
            singleton = new jfm.server.Server(url);
            me = singleton;
        }
        else{
        	singleton.url = url;
        }
        return singleton;
    };
    this.Private.Server = function( url, parameters, method, cb, err, type, async ){

        this.url = url || this.url;
        this.parameters = parameters || this.parameters;
        this.method = method || this.method;
        this.callback = cb || this.callback;
        this.errorCallback = err || this.errorCallback;
        this.type = type || this.type;
        this.async = async || this.async;
    };
    
    this.serviceCall = function( parameters, method, cb, err, type, async ) {
        try {
        	async = async != undefined? async : this.async;
        	switch(typeof type){
        		case 'boolean':
        			async = type;
        	}
        	
        	switch( typeof err){
        		case 'boolean' :
        			async = type;
        			break;
        		case 'string':
        			type = err;
        	}
        	
        	switch( typeof cb ){
        		case 'boolean' :
        			async = type;
        			break;
        		case 'string':
        			type = err;
        	}
        	
        	switch(typeof method){
        		case 'boolean' :
        			async = type;
        			break;
        		case 'function' :
        			if(typeof cb == 'function'){
        				err = cb;
        			}
        			cb = method;
        	}
        	
        	switch(typeof parameters){
        		case 'boolean' :
        			async = type;
        			break;
        		case 'string':
        			type = err;
        		case 'function' :
        			if(typeof method == 'function'){
        				err = method;
        			}
        			cb = parameters;
        	}
        	
            this.parameters = typeof (parameters ) == 'object' && parameters != null ? parameters : this.parameters;
            
            var param = this.parameters;
            for(var k in this.parameters){
                param.hasOwnProperty(k) && (typeof param[k] == 'object') && (param[k]=Serialize.serialize(param[k] ));
            }   
            param.method = param.method || method || this.method;
            var aj = $.ajax({
                url : this.url,
                type : "POST",
                data : param,
                success : cb || this.callback,
                error : err ||  this.errorCallback,
                dataType : type || this.type,
                async : async 
            });
            return aj;
        }
        catch (r) {
            (cb || me.errorCallback)(r);
        }
    };
};





/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


fm.Package("jfm.cache");
fm.Import("jfm.server.Server");
fm.Class("Cache");
jfm.cache.Cache = function (me, Server){this.setMe=function(_me){me=_me;};

    var tmplServ, tempalateStorage, singleton;
    this.shortHand = "Cache";
    
    this.getTemplate = function(name, path, cb){
        
        if(typeof path == 'string'){
            name = path + "/" +name;
        }
        else if (typeof path == 'function'){
            cb = path;
        }
        if(tempalateStorage[name]){
        	cb && cb(tempalateStorage[name]);
            return tempalateStorage[name];
        }
        var async = cb ? true:false;
        tmplServ.serviceCall({data:name}, async, function(resp){
            tempalateStorage[name] = resp;  
            cb && cb(resp);
        });
        
        return tempalateStorage[name];
    };
    
    this.Static.getInstance = function(){        
        if(!singleton){
            singleton = new Cache();
        }
        return singleton;
    };
    
    this.Cache = function(){
    	tmplServ = Server.newInstance("template", undefined, "getTemplate", null, null, 'html');
        tempalateStorage = {};
    };
};

/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

fm.Package("jfm.html");
fm.Class("Constants");
jfm.html.Constants = function (me){this.setMe=function(_me){me=_me;};
    Static.Const = {
        mail:/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i            
    } ;
};/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
fm.Package("jfm.html");
fm.Import("jfm.lang.Character");
fm.Import("jfm.html.Img");
fm.Import("jfm.html.Span");
fm.Class("Popup", "jfm.html.Container");
jfm.html.Popup = function (base, me, Character, Img, Span, Container){this.setMe=function(_me){me=_me;};
    
    this.shortHand = "Popup";
    var pHead, pBody, pClose, callback, singleton;
    var me = this;    
    this.Private.Popup = function(cb){
        callback = cb;
        var Top = document.documentElement.scrollTop,
        Left = document.documentElement.scrollLeft + 100;
        var config = {
            'class':"jfm-popup",
            css:{
                top:Top,
                left:Left,
                display:'none'
            }
        };
        base(config);
        pBody = new Container({
            'class':"jfm-body"
        });
        pHead = new Container({
            'class':"jfm-head unselectable"
        });
        pClose = new Img({
            'class':"jfm-close", 
            src:"img/close-button.jpg",
            width:'auto',
            height:'auto'
        }); 
        this.add([pClose, pHead, pBody]);
        pClose.el.bind('click',function(){
            me.hide();
        });
        this.method('keyup',function (e) {
            if (e.keyCode == Character.keys.ESCAPE) {
                me.hide();
            }
        });
        this.el.appendTo('body');
    };
    Static.getInstance = function(){
        if(!singleton){
            singleton = new jfm.html.Popup();
        }
        return singleton;
    };
        
    this.pBody = function(elem){
        pBody.el.empty();
        pBody.add(elem);
        return  pBody.el.children();
    };
    
    
    this.hide = function (){    	
        this.el.hide();
        if (callback) callback();
        return true;
    };
    
    this.pHead = function(elem) {
        pHead.el.empty().show().width(pBody.el.width());
        pHead.add(elem);       
        return pHead;
    };
    
    this.getContainer = function(){
        return pBody.el.children();
    };
    
    this.show = function (leftMargin, topMargin) {

        this.updateLayout(leftMargin, topMargin);
        this.el.fadeIn(250,function(){
            pHead.el.width(pBody.el.width());
        });
        this.el.trigger("focus");
    };
    
    this.updateLayout = function(leftMargin, topMargin){
       
        var width = parseInt(this.el.css("width"),10),
        height = parseInt(this.el.css("height"),10),
        top = $(document).scrollTop(),
        left =$(document).scrollLeft(),
        screenWidth = $(window).width() - 10,
        screenHeight = $(window).height() - 24;
        if(isNaN(width)) width = this.el.width();
        if(isNaN(height))height = this.el.height();
        left = left + (screenWidth - width) / 2;            
        top = (screenHeight - height) > 0 ? top + (screenHeight - height) / 2 : top;
        leftMargin = leftMargin?leftMargin:0;
        topMargin = topMargin?topMargin:10;
        this.el.css({
            top: top+topMargin,
            left: left +leftMargin
        });
        pHead.el.width(pBody.el.width());
    };
    
    this.showHint = function(el){        
       
        var span = new Span({text:el.attr('hintText'), css:{'text-align':'right', color:'#666'}});
        span.el.width(el.width() + 20).height(el.height() -3).css("margin-top",'3px');
        this.pBody(span.el);
        pBody.el.css("margin",0);
        pHead.el.hide();        
        pClose.el.hide();
        var left =  el.position().left - el.width() - 30, top =  el.position().top;
        this.el.css({left:left, top: top,"padding":"0","margin":"0"});
        this.el.show();
    };
    
    this.hideHint = function(){
        pBody.el.css("margin",'');
        this.el.css({"padding":"","margin":""});
        this.hide();
    };
};

fm.Package("jfm.html.form");
fm.Import("jfm.html.Constants");
fm.Import("jfm.html.Popup");
fm.Class("Text");
jfm.html.form.Text = function (me, Constants, Popup){this.setMe=function(_me){me=_me;};

    var originalColor, placeholder, datatype;
    this.init = function(){
    	Static.isPlaceHoderSuported = 'placeholder' in document.createElement("input");
    };
    this.Text = function(config){
        
        if(config instanceof jQuery){
            this.el = config;
        }
        else if(config.nodeType == 1){
            this.el = jQuery.apply(this, arguments);
        }
        else{
            this.el = jQuery.call(this,'<input />', config);
        }
        this.el.attr("autocomplete","off");
        this.el.blur(el_blur).click(el_click).keyup(el_keyup).keydown(el_keydown);
        originalColor = this.el.css('color');
        datatype = this.el.attr("datatype");
        //!this.isPlaceHoderSuported && ( placeholder = this.el.attr('placeholder') );
        placeholder = "testing..";
        enableHint(this.el);
    };    
    
    Static.convertToJfm = function(inputs){  
        var arr = [];
        if(inputs instanceof jQuery){
            inputs.each(function(){
                if(this.type == 'text'){
                    arr.push(new jfm.html.form.Text(this));
                }
            });
        }
        return arr;
    };
    
    function varifyValue(value){
        switch(datatype){
            case 'email':{
                mailCheck(value);
                break;
            }
            case 'number':{
                numbercheck(value);
                break;
            }
        }
    }
    
    this.verify = function(value){
        varifyValue(value);
    };
    
    function mailCheck(value){
        if(value && value.search(Constants.mail) == -1){
            throw "Please enter a valid email address.";
        }
    }
    
    function numbercheck(value){
        if(value && isNaN(value)){
            throw "Only Number is allowed!";
        }
    }
    
    function el_keydown(e){
        if(placeholder){
            if(this.value == placeholder && String.fromCharCode(e.keyCode)){
                this.value = "";
                this.style.color = originalColor;
            }           
        }
    }
    
    function el_keyup(e){
        if(!this.value && placeholder){            
            this.style.color = "#666666";
            this.value = placeholder;
            textSelect(this, 0, 0);
        }
    }
    
    function el_blur(){
        try{
            varifyValue(this.value); 
            this.value && jQuery(this).next().show().removeClass("fail").addClass("pass");
        }catch(e){
        	jQuery(this).next().show().removeClass("pass").addClass("fail");
        }
    }
    function el_click(){
        this.value == placeholder && textSelect(this);
    }
    function textSelect(inp) {
        if (inp.createTextRange) {
            var r = inp.createTextRange();
            r.collapse(true);
            r.moveEnd('character', 0);
            r.moveStart('character', 0);
            r.select();
        }else if(inp.setSelectionRange) {
            inp.focus();
            inp.setSelectionRange(0, 0);
        }
    }
    
    function enableHint (self){ 
    	self.before('<label class="placeholder"> ' + placeholder+' </lebel>');
    }
};

fm.Package("com.post");
fm.Import("jfm.cache.Cache");
fm.Import("jfm.html.form.Text");
fm.Class("Top", "jfm.html.Button");
com.post.Top = function (base, me, Cache, Text, Button){this.setMe=function(_me){me=_me;};


	this.Top = function(center) {
		base({
			html : "Post",
			'class':'green-btn',
			css : {
				'background-color' : "#ccc",
				"position" : "absolute",
				"right" : "5px"
			}
		});
		
		this.el.click(function(e) {
			Cache.getInstance().getTemplate("post", function(resp) {
				center.reset();
				center.add(new Container({
					html : resp
				}));
				center.el.find("form").submit(function(e){
					e.preventDefault();
					var data = jfm.html.FormManager.getData(this);
					Server.getInstance("post").serviceCall(data,'save');
					return false;
				});
				setTimeout(function() {
					jfm.html.form.Text.convertToJfm(center.el.find("input[type='text']"));
				}, 100);
			});
		});
	};
};

/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

fm.Package("jfm.html");
fm.Class("Combobox", "jfm.html.Container");
jfm.html.Combobox = function (base, me, Container){this.setMe=function(_me){me=_me;};

    
    this.shortHand = "Combobox";
    var element, onChangeCB, self,notFoundCallback,
    _selected_pair,
    _key_list,
    _settings,
    _text_box,
    _indexedList,
    _value_list,
    _result_box,
    _btn,
    _selected_element = $("noelem"),
    KEY_UP = 38,
    KEY_DOWN = 40,
    KEY_ENTER = 13;
    
    this.Combobox = function(list, options, nfc ){
        notFoundCallback = nfc;
        self = this;
        base({
            "class": Component.getCSSClass(options.class + " jfm-combobox")
        });
        element = this.el;
        if (list == null ) {
            throw "list size is zero!";
        }
        
        _settings = {
            defaultText : "",
            name:"",
            maxDisplayResult : 1000,
            triggerAtStart : true,
            hideButton : false,
            showLoadingIcon : false,
            ignoreNumberOfCharacters : 0,
            noFillUpAtStart : false,
            depth : 2,
            hintText : "",
            inputBoxCSS : {},
            onKeyDown: undefined,
            onKeyUp: undefined,
            resultBoxCSS : {},
            inputTabIndex : -1,
            shortKey : "ctrl + shift + c",
            searchFunction : undefined,
            resultFunction : undefined
        };
        _settings = jQuery.extend(_settings, options);
        
        ui();
        list = this.updateData(list, options);
        
        _text_box.attr('tabindex', _settings.inputTabIndex).keyup(
            textboxKeyUp).keydown(textboxKeyDown).click(textboxClick)
        .focus(textboxOnFocus).blur(textboxOnBlur);
        _result_box.mousemove(result_mouseEnterEvnt).bind("FocusOn",
            result_focusOnEvnt).click(result_clickOnEvnt);
        $(document).bind("click", function(e) {
            if (_btn && (_btn.get(0) == e.target))
                return;
            if ((_text_box.get(0) == e.target))
                return;
            _result_box.hide();
        });
        $(document).keydown(
            function(e) {
                if (  checkMatchKeys ( e )) {
                    if ( element[0].offsetLeft != 0
                        && element[0].offsetTop != 0) {
                        textboxClick();
                        return false;
                    }
                }
                return true;
            });
        
    };
    
    this.getSelected = function(){
    	return {key:this.el.find("input").val(), value: this.el.find("input").attr('key')};
    };
    
    this.updateData= function(list, options){
        !list && (list = []);
        if( list.length > 0 && typeof list[0] == 'string'){
            list = converList(list);
        }
        else if( list.nodeName == "SELECT"){
            var templist = createListFromSelect(list);
            options.name = options.name || list.name;
            jQuery(list).after( this.el);
            jQuery(list).hide();
            list = templist;            
        }
        indexing(list);
        return list;
    }
    
    this.onChange = function(data){
        if(typeof data == 'function'){
            onChangeCB = data;
        }
        else if(typeof onChangeCB == 'function'){
            onChangeCB(data.v, data.k);
        }
    }
    
    function createListFromSelect(list){
        var option = jQuery(list).find('option:first'),
        newList = [];
        while(option.length){
            newList.push({
                k:option.html(), 
                v: option.val()
                });
            option = option.next();
        }
        return newList;
    }
    
    function converList(list){
        
        var newList = [], temp;
        for(var k=0; k < list.length; k++){
            temp = {
                v:k, 
                k : list[k]
                };
            newList.push(temp);
        }
        return newList;
    }
    
    function getShortKey() {

        var keys = _settings.shortKey.replace(/\s/g, "").toLowerCase()
        .split("+");
        if (keys.length == 0) {
            return false;
        }
        var baseKeys = {
            ctrlKey:false, 
            shiftKey:false, 
            altKey:false
        };
        var otherKey = {};
        for( var k in keys ){
            if( keys[ k ].length > 1){
                baseKeys[ keys[ k ] + "Key" ] = true;
            }
            else{

                otherKey[ keys[ k ].toLowerCase() ] = true;
            }
        }
        return {
            base : baseKeys, 
            other: otherKey
        };
    }
    
    function checkMatchKeys( e ){
        var keys = getShortKey( );
        var base = keys.base;
        var other = keys.other;
        var checkMatchKeys = function ( e ){
            if( e["ctrlKey"] == base[ "ctrlKey" ] && e["shiftKey"] == base[ "shiftKey" ] && e["altKey"] == base[ "altKey" ] ){
                if( other[ String.fromCharCode( e.keyCode ).toLowerCase() ] ){
                    return true;
                }
            }
            return false;
        };
        return checkMatchKeys( e );

    }
    
    function createTextBox() {

        return $("<input />", {
            "class" : "input_combo",
            name : _settings.name
        }).css(_settings.inputBoxCSS).appendTo(element);
    }

    function createResultContainer() {

        var cssProp = {
            'display' : 'none',
            "overflow" : "auto",
            "overflow-x" : "hidden"
        };

        return $("<div />", {
            "class" : "combo_popup",
            css : cssProp
        }).css(_settings.resultBoxCSS).appendTo('body');
    }

    function createBtn() {

        return $("<div />", {
            "class" : "combo_btn"
        }).appendTo(element);
    }
    
    function createLoadingBtn() {

        return $("<div />", {
            "class" : "combo-loading",
            css : {
                display : 'none'
            }
        }).appendTo(element);
    }
    
    function ui() {

        element.css({
            position : "relative"
        }).empty();

        _text_box = createTextBox();
        _result_box = createResultContainer();
        if (!_settings.hideButton) {
            _btn = createBtn();
            _btn.click(textboxClick);
        }
        else if (_settings.showLoadingIcon) {

            _btn = createLoadingBtn();
        }
    }

    function separateInKeyValueList(list) {
        var key_list = [];
        _value_list = [];
        for ( var k = 0, len = list.length; k < len; k++) {
            _value_list.push(list[k].v);
            key_list.push({
                k : list[k].k,
                v : k
            });
        }
        return key_list;
    }
    
    function indexing(list) {

        var newList = separateInKeyValueList(list);
        _key_list = newList;
        list = null;
        _indexedList = indexSortedArray( newList, _settings.depth, 0 );

        if (_settings.hintText != "") {
            setTextboxValues(_settings.hintText);
        }
        else if ( _settings.triggerAtStart && !_settings.noFillUpAtStart ) {
            _selected_pair = searchResultInIndexedArray(
                _settings.defaultText, _indexedList, _settings )[0];
            _selected_pair = _selected_pair || newList[0];
            setTextboxValues();
            self.onChange( _selected_pair );
        }
        newList = null;
        return _indexedList;
    }

    function textboxKeyUp(e) {

        switch (e.keyCode) {
            case KEY_DOWN :
            case KEY_UP :
                break;
            case KEY_ENTER :
                _selected_element.trigger("click");
                $(this).trigger('blur');
                return false;
                break;
			default : {
                createPopup($(this).val());
                break;
            }
        }
    }

    function textboxKeyDown(e) {

        switch (e.keyCode) {
            case KEY_DOWN : {
                if (_selected_element.length) {
                    if (_selected_element.next().length)
                        _selected_element.next().trigger('FocusOn');
                }
                else {
                    _selected_element = $("li:first", _result_box);
                    _selected_element.trigger('FocusOn');
                }
                break;
            }
            case KEY_UP : {
                if (_selected_element.prev().length)
                    _selected_element.prev().trigger('FocusOn');
            }
            break;
            case KEY_ENTER:{
                return false;
            }
        }
    }

    function textboxClick() {
        _text_box.select();
        _text_box.focus();
        createPopup();
    }

    function textboxOnFocus() {

        if (_settings.hintText != ''
            && $.trim(this.value) == $.trim(_settings.hintText)) {
            this.value = '';
            this.style.color = '#000000';
        }

    }

    function textboxOnBlur() {

        if (_settings.hintText != '' && $.trim(this.value) == '') {
            this.value = $.trim(_settings.hintText);
            this.style.color = '#666666';
        }
    }

    function result_mouseEnterEvnt(e) {
        $(e.target).trigger('FocusOn', true);
        return;
    }
    
    function result_focusOnEvnt(e, data) {

        var target = e.target;
        if (target.nodeName.toUpperCase() != "LI")
            return;
        _selected_element.removeClass("selected");
        var popupHeight = _result_box.height();
        _selected_element = $(target);
        _selected_element.addClass("selected");
        if (!data) {
            _result_box[0].scrollTop = (_selected_element.index() + 1) * 25
            - popupHeight;
        }
        return;
    }
    
    function result_clickOnEvnt(e) {

        var target = e.target;
        if (target.nodeName.toUpperCase() != "LI")
            return;
        var _clicked_li = $(target);
        var key = _value_list[_clicked_li.attr('key')];
        if (true) {
            _selected_pair = {
                k : _clicked_li.text(),
                v : key
            }
            setTextboxValues();
            if (_selected_pair.v && _selected_pair.v != "") {
                self.onChange( _selected_pair);
            }
        }
        _result_box.hide();
        _text_box.blur();
        return;
    }
    
    function setTextboxValues(hint) {
        if (hint && hint != "") {
            _text_box.val(hint).css("color", "#666666");
        }
        else {
            _text_box.val(_selected_pair.k).attr('key',_selected_pair.v).css("color", "");
        }
    }

    function createUi(list, searchString) {
			
        if(typeof _settings.resultFunction== "function"){
				
            _settings.resultFunction( list, _value_list );
            return ;
        }
        var pos = _text_box.offset();
        var height = parseInt( _result_box.css('height') );
        var winHeight = $(window).height();
        if( height > (winHeight - pos.top) ){
            pos.top = pos.top - height - _text_box.height();
        }
        _result_box.empty().width(_text_box.width()).css({
            'display': '',
            top:pos.top + _text_box.height(), 
            left:pos.left
            });
        if (!list.length && isNaN(searchString)) {

            _result_box.html("It is not present in the list");
            return;
        }

        var ulList = createResultUI(list);
        ulList.appendTo(_result_box);
        (_selected_element = $("li:first", ulList)).trigger("FocusOn");
    }
    
    function createPopup(searchString) {

        if( _settings.ignoreNumberOfCharacters == 0){
            searchString = searchString?searchString:"";
        }
        if (searchString == undefined) {
            _result_box.hide();
            return;
        }
        if(searchString.length == 0){
            element.trigger("combo_data_cleared");
        }
        if (searchString.length < _settings.ignoreNumberOfCharacters) {
            if(searchString.length != 0){
                element.trigger("combo_data_cleared");
            }
            _result_box.hide();
            return;
        }
        var resultArray;
        if( _settings.searchFunction ){

            resultArray  = _settings.searchFunction( searchString, _key_list );
        }
        else{

            resultArray = searchResultInIndexedArray( searchString,
                _indexedList, _settings );
        }

        if (resultArray.length) {
            createUi(resultArray);
        }
        else if (notFoundCallback) {

        	_btn && _btn.show();
            notFoundCallback(searchString, function(list) {
                _result_box.empty();
                var newList = separateInKeyValueList(list);
                createUi(newList, searchString);
                _btn && _btn.hide();
            });
        }
        else{
            createUi([]);
            _result_box.hide();
        }
    }

    this.updateKey = function(origKey, value) {

        key = origKey.toString().toLowerCase();
        var temp = _indexedList;
        for ( var m = 0; m <= _settings.depth; m++) {
            temp = temp[key.charAt(m)];
            if (temp == undefined) {
                break;
            }
        }
        if (temp != undefined) {
            for ( var obj in temp) {

                if (temp[obj].k && (temp[obj].k.toLowerCase() == key) ) {
                    _value_list[temp[obj].v] = value;						
                    break;
                }
            }
        }
        else {

            this.addNewEntry(key, value);
        }
    };

    this.addNewEntry = function( origKey, value ) {

        key = origKey.toString();
        var k = _value_list.length;
        _value_list.push(value);
        var tmpArr = [{
            v : k,
            k : origKey
        }];
        var temp = _indexedList;
        var keyString;
        var indexed = indexSortedArray(tmpArr, _settings.depth, 0	);
        for ( var m = 0; m <= _settings.depth && m < key.length; m++) {

            keyString = key.charAt(m).toLowerCase();
            if (temp[keyString] == undefined) {
                break;
            }
            temp = temp[keyString];
            indexed = indexed[keyString];
        }
        if (temp[keyString] == undefined) {
            temp[keyString] = indexed[keyString];
				
        }
        else {
            temp.push(indexed);
        }
        _key_list.push( tmpArr[0] );
        _value_list.push( value );
    };

    function createResultUI(list) {

        var $ul = $('<ul/>', {});
        var i = 0;
        $ul.attr("tabindex", 2);
        var obj = "";
        var len = list.length;
        for (; i < len; i++) {
            obj += "<li style='line-height:25px;display: block; cursor: pointer' key='"
            + list[i].v + "'>" + list[i].k + "</li>";
        }
        ($ul).html(obj);
        return $ul;
    }
    
    function searchResultInIndexedArray(searchString, indexedArray, _settings) {
        searchString = searchString.toLowerCase();
        function searchStr(indexedArray, depth, start) {
            var ch, resultArray = indexedArray, strlen = searchString.length, len = strlen < depth
            ? strlen
            : depth;
            for ( var i = start; i < len; i++) {
                ch = searchString.charAt(i);
                resultArray = resultArray[ch];
                if (!resultArray)
                    return [];
            }
            if (strlen > len) {
                var localIndexedArray = indexSortedArray(resultArray,
                    strlen - 1, len);
                resultArray = searchStr(localIndexedArray, strlen + 1, len);
            }
            return resultArray;
        }
        var totalResults = 0;
        function convertResultIntoArray(searchedList, len, maxListLen) {

            if (!searchedList)
                return [];
            var resultArray = [], k;
            if ( searchedList[0] && typeof searchedList[0].k != "object" && typeof searchedList[0].k != "undefined" ) {
                for (k in searchedList) {
                    var val = searchedList[k].k;
                    if ( val.length >= len && maxListLen > totalResults ){						
                        totalResults++;
                        resultArray.push( searchedList[k] );
                    }else{                    	
                        break;
                    }
                }
                return resultArray;
            }
            for ( var i in searchedList ) {
                resultArray  = resultArray.concat(convertResultIntoArray(
                    searchedList[i], len, maxListLen));				 
                if( totalResults >= maxListLen ){					 
                    break;
                }
            }
            return resultArray;
        }
        var searchedArray = searchStr(indexedArray, _settings.depth + 1,
            0);
        return convertResultIntoArray( searchedArray, searchString.length, _settings.maxDisplayResult);
    }
	
    function indexSortedArray( list, maxDepth, currentDepth) {

        var indexed = {};
        function setString( clone, str ){
            var ch;
            for( var m = currentDepth; m< maxDepth; m++ ){
                ch = str.charAt(m).toLowerCase();
                clone[ ch ] = clone[ ch ] || { };
                clone = clone[ ch ];
            }
            ch = str.charAt( m ).toLowerCase( );
            clone[ ch ] = clone[ ch ]||[ ];
            return clone[ ch ];
        }
        function createIndexArray( list ){

            var kTh;
            for( var k =0, len = list.length; k<len; k++ ){
                kTh = list[ k ];
                setString( indexed, kTh.k ).push( kTh );

            }
            return indexed;
        }
        return createIndexArray( list );
    }
};


/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

fm.Package("com.region");
fm.Import("jfm.html.Span");
fm.Import("com.post.Top");
fm.Import("jfm.html.Combobox");
fm.Class("Topbar", 'jfm.html.Container');
com.region.Topbar = function (base, me, Span, Top, Combobox, Container) {
	this.setMe = function( _me ) {
		me = _me;
	};
	
	var openedMenu;
	
	function loadFacebook( ) {
		return ;
		var c = document.createElement("script");
		c.src = '//connect.facebook.net/en_US/all.js';
		document.getElementsByTagName('head')[0].appendChild(c);
	}
	
	this.Topbar = function( division ) {
		
		base({
		    height : 100,
		    css : {
			    'background-color' : '#FCF0FE'
		    }
		});
		
		loadFacebook();
		
		var self = this;
		this.add(new Container({
		    html : "<a href='#'>Kerana</a>",
		    'class' : "logo"
		}));
		var s;
		this.add(new Button({
		    html : "Register",
		    'class' : 'register green-btn',
		    click:function(){
		    	location.hash="register";
		    	return false;
		    }
		}));
		
		$(document).click(function( ) {
			openedMenu && openedMenu.hide();
		});
		
		Cache.getInstance().getTemplate('home', function( data ) {
			self.el.append(data);
			self.el.find(".category").click(division, onCategoryClick);
		});
	};
	
	function onCategoryClick( e ) {
		if (e.target.nodeName == "SPAN") {
			openedMenu && openedMenu.hide();
			openedMenu = $(e.target).next().show();
		}
		else if (e.target.nodeName == "A") {
			openedMenu.hide();
			if (fm.isExist("com.home.SubCategory")) {
				com.home.SubCategory.showSubCategory(e.target.href);
			}
			else {
				fm.Include("com.home.SubCategory", [ e.data, e.target.href ]);
			}
		}
		return false;
	}
	
};
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
fm.Include("plugin.Hashchange");
fm.Import("jfm.division.Division");
fm.Import("jfm.query.QueryStr");
fm.Import("jfm.hash.HashChange");
fm.Import("com.region.Topbar");
fm.Class("App");

App = function (me, Division, QueryStr, HashChange, Topbar){this.setMe=function(_me){me=_me;};  

	function updateLayout() {
		$(window).ready(function() {
			var win = jQuery(window);
			win.resize(function() {
				var w = win.width(), h = win.height();
				var m = $('body').width(w).height(h)[0].resize;
				m && m(w, h);
			});
			$('body').trigger('resize');
		});
	}
	Static.main = function() {
		
		updateLayout();
		var d = new jfm.division.Division({
			id : "jfm-division",
			'class' : "bg"
		});
		var top = new Topbar(d);
		new jfm.hash.HashChange(d);
		if (QueryStr.getQuery("method") == 'verify') {
			location.hash = "registration";
		}
		d.top.add(top);
		d.addTo('body');
	//	console.log(new Date().getTime() - t, new Date().getTime() - t2);
	};
};

fm.isConcatinated = false;
