fm.Package("shop");
fm.Class("SearchLocation", "jfm.html.Container");
shop.SearchLocation = function (base, me, Container) {
	this.setMe = function( _me ) {
		me = _me;
	};
	
	function getLatLong( address, cb ) {
		var geo = new google.maps.Geocoder;
		
		geo.geocode({
			'address' : address
		}, function( results, status ) {
			if (status == google.maps.GeocoderStatus.OK) {
				return cb(results);
			}
			alert("Geocode was not successful for the following reason: " + status);
			
		});
	}
	
	this.SearchLocation = function( division, map ) {
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
		var btn = new Button({
		    html : "list",
		    'class' : "add-category green-btn",
		    click : function( ) {
			    getLatLong(input.val() + " INDIA", function( res ) {
				    console.log(res);
				    for ( var k = 0; k < res.length; k++) {
					    resultCont.add(new Container({
					        height : 30,
					        index : k,
					        'class' : "geo-address",
					        html : res[k].formatted_address,
					        click : function( ) {
						        map.getMarker().setPosition(res[$(this).attr("index")].geometry.location);
						        map.getGmap().setCenter(res[$(this).attr("index")].geometry.location);
					        }
					    }));
				    }
			    });
		    }
		});
		var resultCont = new Container({

		});
		this.add(resultCont);
		btn.el.click(function( ) {
			return false;
		});
		this.add(1, btn);
		
	};
};
