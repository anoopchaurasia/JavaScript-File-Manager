fm.isConcatinated = true; 
fm.Package("lib.google");
fm.Class("Map", "jfm.html.Container");
lib.google.Map = function (base, me, Container) {
	this.setMe = function(_me) {
		me = _me;
	};
	var gmap, marker, dragendCB;
	function GetLocation(location) {
		var latlon = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);
		gmap.setCenter(latlon);
		marker = getMarker(latlon);
		google.maps.event.addDomListener(marker, "dragend", function() {
			for ( var k = 0; k < dragendCB.length; k++) {
				dragendCB[k].apply(this, arguments);
			}
		});
		getCircle(latlon);
	}

	this.addMarkerDragEndListner = function(cb) {
		dragendCB.push(cb);
	}

	function getMarker(pos) {
		return new google.maps.Marker({
			map : gmap,
			position : pos,
			draggable : true,
			icon : "http://maps.gstatic.com/intl/en_ALL/mapfiles/dd-end.png"
		});
	}

	this.getGmap = function() {
		return gmap;
	};

	function getCircle(pos) {
		return new google.maps.Circle({
			map : gmap,
			center : pos,
			radius : 2000,
			strokeColor : "#afafaf",
			fillOpacity : .2,
			fillColor : "#fdfdfd",
			strokeOpacity : .8
		});
	}

	this.getMarker = function() {
		return marker;
	};

	

	this.Map = function() {
		dragendCB = [];
		
		window.initialize = function() {

			var mapOptions = {
				center : new google.maps.LatLng(-34.397, 150.644),
				zoom : 12,
				mapTypeId : google.maps.MapTypeId.ROADMAP,
				panControl : false,
				scaleControl : false,
				rotateControl : false,
				streetViewControl : false,
				zoomControl : {
					position : google.maps.ControlPosition.RIGHT_BOTTOM,
					style : google.maps.ZoomControlStyle.SMALL
				}
			};
			gmap = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
			navigator.geolocation.getCurrentPosition(GetLocation);
			delete window.initialize;
		};
		base({
			width : "100%",
			height : "100%",
			id : "map_canvas"
		});
		if (window.google && google.maps) {
			setTimeout(initialize, 1000);
		}
		fm.Include("http://maps.googleapis.com/maps/api/js?sensor=false&callback=initialize");
	};

};
fm.Package("shop");
fm.Class("SearchLocation", "jfm.html.Container");
shop.SearchLocation = function (base, me, Container) {
	var geo;
	this.setMe = function(_me) {
		me = _me;
	};
	function getLatLong(address, cb) {
		!geo && (geo = new google.maps.Geocoder);
		geo.geocode({
			'address' : address
		}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				return cb(results);
			}
			alert("Geocode was not successful for the following reason: " + status);

		});
	}

	this.SearchLocation = function(division, map) {

		base({
			width : 300,
			'class' : 'left',
			css : {
				'height' : '100%',
				'background-color' : '#FCF0FE'
			}
		});
		division.left.reset().add(this);

		this.add("<div>Get Location List: </div>");
		this.add("<div class='search-location'><input placeholder='type location'/></div>");
		var input = this.el.find("input");
		input.keyup(function(e){
			e.keyCode == 13 && (getLatLong(input.val() + " INDIA", getAddress));
		});
		var btn = new Button({
			html : "list",
			'class' : "add-category green-btn",
			click : function() {
				getLatLong(input.val() + " INDIA", getAddress);
			}
		});
		
		function getAddress(res) {
			console.log(res);
			resultCont.el.empty();
			for ( var k = 0; k < res.length; k++) {
				resultCont.add(new Container({
					height : 30,
					index : k,
					'class' : "geo-address",
					html : res[k].formatted_address,
					click : function() {
						map.getMarker().setPosition(res[$(this).attr("index")].geometry.location);
						map.getGmap().setCenter(res[$(this).attr("index")].geometry.location);
					}
				}));
			}
		}
		map.addMarkerDragEndListner(function() {
			console.log(arguments);
		});

		var resultCont = new Container({

		});
		this.add(resultCont);
		btn.el.click(function() {
			return false;
		});
		this.add(1, btn);

	};
};
fm.Package("shop");
fm.Import("lib.google.Map");
fm.Import("shop.SearchLocation");
fm.Class("Register");
shop.Register = function (me, Map, SearchLocation) {
	this.setMe = function( _me ) {
		me = _me;
	};
	
	Static.main = function( args ) {
		new me(args[0]);
	};
	
	this.Register = function( division ) {
		
		var map = new Map(division);
		division.center.reset().add(map);
		new SearchLocation(division, map);
	};
};
fm.isConcatinated = false;
