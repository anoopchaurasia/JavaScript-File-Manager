fm.Package("lib.google");
fm.Class("Map", "jfm.html.Container");
lib.google.Map = function(base, me, Container) {
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

	Static.initialize = function() {

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

	this.Map = function() {
		dragendCB = [];
		base({
			width : "100%",
			height : "100%",
			id : "map_canvas"
		});
		if (window.google && google.maps) {
			setTimeout(initialize, 1000);
		}
		fm.Include("http://maps.googleapis.com/maps/api/js?sensor=false&callback=lib.google.Map.initialize");
	};

};
