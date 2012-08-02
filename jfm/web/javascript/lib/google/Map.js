fm.Package("lib.google");
fm.Class("Map", "jfm.html.Container");
lib.google.Map = function (base, me, Container) {
	this.setMe = function(_me) {
		me = _me;
	};
	var gmap;
	function GetLocation(location) {
		var latlon = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);
		gmap.setCenter(latlon);
		getMarker(latlon);
		getCircle(latlon);
	}

	function getMarker(pos) {
		return new google.maps.Marker({
			map : gmap,
			position : pos,
			icon : "http://maps.gstatic.com/intl/en_ALL/mapfiles/dd-end.png"
		});
	}

	function getCircle(pos) {
		return	new google.maps.Circle ({
			map : gmap,
			center : pos,
			radius : 2000,
			strokeColor : "#afafaf",
			fillOpacity:.6,
			fillColor:"#fdfdfd",
			strokeOpacity : .8
		});
	}

	this.Map = function() {
		base({
			width : "100%",
			height : "100%",
			id : "map_canvas"
		});
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
		}
		fm.Include("http://maps.googleapis.com/maps/api/js?sensor=false&callback=initialize");
	};

};