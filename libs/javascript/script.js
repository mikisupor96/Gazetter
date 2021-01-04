<<<<<<< HEAD
// Create map and get user location
$(document).ready(() => {
	createMap()
	updateCountries()
});

// Map 
let map = L.map(`mapid`).setView([51.505, -0.09], 9);

const createMap = async () => {
	const tileOptions = {
		maxZoom: 15,
		attribution: `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`
	}
	let OpenStreetMap_Mapnik = await L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`, tileOptions).addTo(map);
}

// Update countries list
const updateCountries = () => {
	const getCountry = $.ajax("libs/php/getCountry.php")

	getCountry
		.done(result => {
			if (result.status.name === "ok") {
				result["data"].forEach(el => {
					$(`#countryList`).append(new Option(el["name"], el["iso_a2"]));
				});
			}
		})
		.catch(err => {
			console.log(err)
		})
}

// DOM update
$("#search").click(() => {
	$.ajax({
		url: "libs/php/getInfo.php",
		type: `POST`,
		dataType: `json`,
		data: {
			country: $("#countryList").find(":selected").text(),
			countryCode: $("#countryList").val()
		},
		success: async result => {
			await result;
			console.log(result);
		},

		error: err => {return err}
	})
})

const createBounds = (feature) => {
	// Map styles
	const getColor = (d) => {
		return d > 1000 ? `#800026` :
			d > 500  ? `#BD0026` :
			d > 200  ? `#E31A1C` :
			d > 100  ? `#FC4E2A` :
			d > 50   ? `#FD8D3C` :
			d > 20   ? `#FEB24C` :
			d > 10   ? `#FED976` :
						`#FFEDA0`;
	}
	// highlight code
	const highlightFeature = (e) => {
		let layer = e.target;

		layer.setStyle({
			weight: 5,
			color: `#F2F2F2`,
			dashArray: ``,
			fillOpacity: 0.2
		});

		if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
			layer.bringToFront();
		}
	}

	const style = el => {
		return {
			fillColor: getColor(el.properties.density),
			weight: 2,
			opacity: 1,
			color: `C3C3C3`,
			dashArray: `3`,
			fillOpacity: 0.2
		};
	}

	const resetHighlight = (e) => {
		geojson.resetStyle(e.target);
	}

	const zoomToFeature = (e) => {
		map.fitBounds(e.target.getBounds());
	}
	// adding listeners
	const onEachFeature = (feature, layer) => {
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight,
			click: zoomToFeature
		});
	}
	
	geojson = L.geoJson(feature, {
		style: style,
		onEachFeature: onEachFeature
	}).addTo(map);
}

//=============================INFO MAP PANEL=============================//
function infoPanel(apiInfo){
	const info = L.control();

	info.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
		this.update(apiInfo);
		return this._div;
	};
	
	// method that we will use to update the control based on feature properties passed
	info.update = function (name, temperature, sunrise) {
		// this._div.innerHTML = '<h4>US Population Density</h4>' +  (props ?
		// 	'<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
		// 	: 'Hover over a state');
		this._div.innerHTML = `Currently in ${name} there are ${temperature}°C.The sun will rise at ${secondsToHms(sunrise)}`;
	};
	
	info.addTo(map);
}

=======
// Create map and get user location
$(document).ready(() => {
	createMap()
});

// Map function
const createMap = async () => {
	let map = L.map('mapid').setView([51.505, -0.09], 13);

	const tileOptions = {
		maxZoom: 5,
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}
	let OpenStreetMap_Mapnik = await L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', tileOptions).addTo(map);
}

// Update countries list
const getCountry = $.ajax("libs/php/getCountry.php")

getCountry
	.done(result => {
		if (result.status.name == "ok") {
			result["data"].forEach(el => {
				$('#countryList').append(new Option(el["name"], el["iso_a2"]));
			});
		}
	})
	.catch(err => {
		console.log(err)
	})

// DOM update
$("#search").click(() => {
	console.log($("#countryList").find(":selected").text());

	// // GET COUNTRY BORDERS
	$.ajax({
		url: "libs/php/getCountryBorders.php",
		type: 'POST',
		dataType: 'json',
		data: {
			country: $('select').val(),
		},
		success: function(result) {
			// ADD COUNTRY BOUDS
			console.log(result["data"]);
		},

		error: function(err) {console.log(err)}
	})
})
>>>>>>> 6edbf67610864c95d67563aa57b848210c313530
