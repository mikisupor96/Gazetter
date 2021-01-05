//=============================CREATE MAP ON FILE LOAD=============================//
$(document).ready(() => {
	createMap()
	updateCountries()
});
//=============================MAP CREATION=============================//
let map = L.map(`mapid`).setView([51.505, -0.09], 4);

const createMap = async () => {
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		id: 'mapbox/light-v9',
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		tileSize: 512,
		zoomOffset: -1
	}).addTo(map);
}
//=============================ADD COUNTRIES=============================//
const updateCountries = () => {
	// ajax call to get countries from json file
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
//=============================DOM UPDATE=============================//
$("#search").click(() => {
	// ajax call to get border feature from json file
	$.ajax({
		url: "libs/php/getCountryBorders.php",
		type: `POST`,
		dataType: `json`,
		data: {
			countryCode: $("#countryList").val()
		},
		success: async result => {
			addBorders(result.data);
		},

		error: err => {return err}
	})
	// ajax call to get all api call information
	$.ajax({
		url: "libs/php/getInfo.php",
		type: `POST`,
		dataType: `json`,
		data: {
			country: $("#countryList").find(":selected").text(),
			countryCode: $("#countryList").val()
		},
		success: async result => {
			console.log(result);
			infoPanel({
				country: $("#countryList").find(":selected").text(),
				news_1: {
					content: result["news"]["article_1"]["content"],
					title: result["news"]["article_1"]["title"],
				},
				news_2: {
					content: result["news"]["article_2"]["content"],
					title: result["news"]["article_2"]["title"],
				},
				weather_description: result["weather"]["description"],
				weather_humidity: result["weather"]["humidity"],
				weather_rain: result["weather"]["rain"],
				weather_temp: result["weather"]["temp"],
				wikipediaInfo: result["wikiExtract"],
			})
		},

		error: err => {return err}
	})
})
//=============================INFO MAP PANEL=============================//
function infoPanel(apiInfo){
	let {country, news_1, news_2, weather_description, weather_humidity, weather_rain, weather_temp, wikipediaInfo} = apiInfo;
	
	newWikiInfo = wikipediaInfo.split(".").splice(0,5).join(" ");
	newArticle1 = news_1["content"].split(".").splice(0,5).join(" ");
	newArticle2 = news_2["content"].split(".").splice(0,5).join(" ");

	var info = L.control();

	info.onAdd = function(){
		this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
		this.update();
		return this._div;
	};

	// method that we will use to update the control based on feature properties passed
	info.update = function(props) {
		this._div.innerHTML = `
			<div class="card" style="width: 25rem;">
				<h5 class="card-header">${country}</h5>
				<div class="card-body">
					<h5 class="card-subtitle mb-2 text-muted">Temperature: ${weather_temp}°C | Rain: ${weather_rain || "none"} | Humidity: ${weather_humidity}%rh | ${weather_description}</h5>
					<p class="card-text">${newWikiInfo}</p>
					<ul class="list-group list-group-flush">
						<li class="list-group-item">
							<h5>${news_1.title}</h5>
							<p class="card-text">${newArticle1}</p>
						</li>
						<li class="list-group-item">
							<h5>${news_2.title}</h5>
							<p class="card-text">${newArticle2}</p>
						</li>
				  	</ul>
				</div>
			</div>
		`
	};

	info.addTo(map);
}
//=============================ADD MAP BORDERS=============================//
function addBorders(data){
	L.geoJson(data, {style: style}).addTo(map);

	var geojson = L.geoJson(data, {
		style: style,
		onEachFeature: onEachFeature
	}).addTo(map);

	function getColor(d) {
		return d > 1000 ? '#800026' :
			   d > 500  ? '#BD0026' :
			   d > 200  ? '#E31A1C' :
			   d > 100  ? '#FC4E2A' :
			   d > 50   ? '#FD8D3C' :
			   d > 20   ? '#FEB24C' :
			   d > 10   ? '#FED976' :
						  '#FFEDA0';
	}

	function style(feature) {
		return {
			fillColor: getColor(feature.properties.density), // change this
			weight: 2,
			opacity: 1,
			color: 'white',
			fillOpacity: 0.4
		};
	}

	function highlightFeature(e) {
		var layer = e.target;
	
		layer.setStyle({
			weight: 0.5,
			color: '#D3D3D3',
			fillOpacity: 0.3
		});
	
		if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
			layer.bringToFront();
		}
	}

	function resetHighlight(e) {
		geojson.resetStyle(e.target);
	}

	function zoomToFeature(e) {
		map.fitBounds(e.target.getBounds());
	}

	function onEachFeature(feature, layer) {
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight,
			click: zoomToFeature
		});
	}

}




