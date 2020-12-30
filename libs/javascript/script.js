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
