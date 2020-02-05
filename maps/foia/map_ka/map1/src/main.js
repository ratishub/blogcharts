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
			this._div.innerHTML = '<h4>გამჭვირვალობის რეიტინგი ინფრასტრუქტურის სამინისტროს ხაზით: </h4>' +  (props ?
				'<b>' + props.foia_municipality + '</b>' + ': '+ props.foia_mrdi_score
				: 'მაუსი გადაატარეთ მუნიციპალიტეტს, ან გაადიდეთ');
		};

		info.addTo(map);


		// get color depending on population density value
		function getColor(d) {
			return d > 2 ? '#1a9641' :
			       d > 1 ? '#a6d96a' :
			       d > 0 ? '#fdae61' :
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
				fillColor: getColor(feature.properties.foia_mrdi_score)
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
			'<i style="background:' + '#fdae61' + '"></i> ' + '1'+ '<br>'+
			'<i style="background:' + '#a6d96a' + '"></i> ' + '2'+ '<br>'+
			'<i style="background:' + '#1a9641' + '"></i> ' + 'უმაღლესი (3)'+ '<br>'
			;
			return div;
		};

		legend.addTo(map);

	startMarker.on('dragend', function(event) {
 map.setView(new L.LatLng( event.target.getLatLng().lat,event.target.getLatLng().lng),zoom);
});

// Add markers to the map
	map.addLayer(districts, abso);		// add it to the map

