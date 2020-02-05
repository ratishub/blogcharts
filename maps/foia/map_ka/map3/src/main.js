// Style background map (OSM Black & White)

		var tiles = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
			maxZoom: 25,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		});
		latlng = L.latLng(42.105628, 43.723102);

// Define map

		var map = L.map('map', {center: latlng, zoom: 7, layers: [tiles]});

// Control that shows data on hover

		var info = L.control();

		info.onAdd = function (map) {
			this._div = L.DomUtil.create('div', 'info');
			this.update();
			return this._div;
		};

		info.update = function (props) {
			this._div.innerHTML = '<h4>გამჭვირვალობის საერთო ინდექსი: </h4>' +  (props ?
				'<b>' + props.foia_municipality + '</b>' + ': '+ props.foia_overal_tscore
				: 'Hover over or zoom to a municipality');
		};

		info.addTo(map);


		// get color depending on population density value
		function getColor(d) {
			return d > 5 ? '#1a9641' :
			       d > 4 ? '#77c35c' :
			       d > 3 ? '#c4e687' :
			       d > 2 ? '#ffffc0' :
			       d > 1 ? '#fec981' :
			       d > 0 ? '#f17c4a' :
			      d > -1 ? '#d7191c' :
			         '#cccccc';
		}

		function style(feature) {
			return {
				weight: 0.3,
				opacity: 0.3,
				color: 'blue',
				dashArray: '0.3',
				fillOpacity: 0.3,
				fillColor: getColor(feature.properties.foia_overal_tscore)
			};
		}

		function highlightFeature(e) {
			var layer = e.target;

			layer.setStyle({
				weight: 1,
				color: '#666',
				dashArray: '',
				fillOpacity: 0.6
			});

			if (!L.Browser.ie && !L.Browser.opera) {
				layer.bringToFront();
			}

			info.update(layer.feature.properties);
		}
		
		var districts;
		
		function resetHighlight(e) {
			districts.resetStyle(e.target);
			info.update();
		}

		// function zoomToFeature(e) {
		//	map.fitBounds(e.target.getBounds());
		// }

		function onEachFeature(feature, layer) {
			layer.on({
				mouseover: highlightFeature,
				mouseout: resetHighlight
				// ,
				// click: zoomToFeature
			});
		}

		districts = L.geoJson(districts, {
			
			style: style,
			onEachFeature: onEachFeature
		}).addTo(map);
		console.log(districts); 
// Add Legend
		var legend = L.control({position: 'bottomright'});

		legend.onAdd = function (map) {

			var div = L.DomUtil.create('div', 'info legend');

			div.innerHTML += '<i style="background:' + '#cccccc' + '"></i> ' + 'არ შეფასებულა'+ '<br>'+
			'<i style="background:' + '#d7191c' + '"></i> ' + 'ყველაზე დაბალი (0)'+ '<br>'+
			'<i style="background:' + '#f17c4a' + '"></i> ' + '1'+ '<br>'+
			'<i style="background:' + '#fec981' + '"></i> ' + '2'+ '<br>'+
			'<i style="background:' + '#ffffc0' + '"></i> ' + '3'+ '<br>'+
			'<i style="background:' + '#c4e687' + '"></i> ' + '4'+ '<br>'+
			'<i style="background:' + '#77c35c' + '"></i> ' + '5'+ '<br>'+
			'<i style="background:' + '#1a9641' + '"></i> ' + 'უმაღლესი (6)'+ '<br>'
			;
			return div;
		};

		legend.addTo(map);

	startMarker.on('dragend', function(event) {
 map.setView(new L.LatLng( event.target.getLatLng().lat,event.target.getLatLng().lng),zoom);
});

// Add markers to the map
	map.addLayer(districts);		// add it to the map

