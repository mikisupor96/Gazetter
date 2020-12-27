// Create map and get user location
$(document).ready(() => {
	createMap()
});

// Map function
const createMap = () => {
	const mapOptions = {
		center: [51.5, -0.09],
		zoom: 13,
	}

	const tileOptions = {
		maxZoom: 19,
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}

	var latlngs = [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]];

	let map = L.map('mapid', mapOptions);
	let OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', tileOptions).addTo(map);
	
	var polygon = L.polygon(latlngs, {color: 'red'}).addTo(map);
	// zoom the map to the polygon
	map.fitBounds(polygon.getBounds());
}

// AJAX CALLS

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


// // GET COUNTRY BORDERS

// $( "#search" ).click(function() {
// 	$.ajax({
// 		url: "libs/php/getCountryBorders.php",
// 		type: 'POST',
// 		dataType: 'json',
// 		data: {
// 			country: $('select').val(),
// 		},
// 		success: function(result) {
// 			// ADD COUNTRY BOUDS
// 			countryDelimiters = result["data"];
// 			var countryName = $('#countryList').find(":selected").text();
// 			var polygon = L.polygon(countryDelimiters).addTo(mymap).bindPopup(`<b>${countryName}</b>`);
// 			var countryMarker = L.marker(countryDelimiters[0]).addTo(mymap);

// 			// ADD WIKI INFO
// 			$.ajax({
// 				url: "libs/php/getWikiInfo.php",
// 				type: 'POST',
// 				dataType: 'json',
// 				data: {
// 					countryName: countryName,
// 				},
// 				success: function(result) {
// 					if (result.status.name == "ok") {
// 						console.log(result);
// 					}	
// 				},

// 				error: function(jqXHR, textStatus, errorThrown) {}
// 			})

// 			// ADD NEWS ARTICLES

// 			// ADD IMAGES

// 			// ADD COVID DATA 

// 			// ADD CURENCY PERFORMANCE

// 			// ADD CLIMATE TRENDS

// 			// ETC
// 		},

// 		error: function(jqXHR, textStatus, errorThrown) {}
// 	})
// });
