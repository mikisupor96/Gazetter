const map = L.map("map");
const sidebar = L.control.sidebar("sidebar", {
  closeButton: true,
  position: "left",
});
map.addControl(sidebar);

//=============================LOAD ON DOCUMENT READY=============================//
$(window).on("load", function () {
  if ($("#preloader").length) {
    $("#preloader")
      .delay(100)
      .fadeOut("slow", function () {
        $(this).remove();
      });
  }
});

$(document).ready(function () {
  populateSelect();
  getUserCoords();
  createMap();
});

//=============================GET USER COORDS=============================//
function getUserCoords() {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function success(pos) {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;

    addIcon([lat, lon]);
    getUserLocation(lat, lon);

    map.setView(L.latLng([lat, lon]), 6);
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  navigator.geolocation.getCurrentPosition(success, error, options);
}

//=============================ADD COUNTRIES=============================//
function populateSelect() {
  $.ajax({
    url: "source/php/getCountry.php",
    type: `GET`,
    dataType: `json`,
    success: (result) => {
      result["data"].forEach((el) => {
        $(`#countryList`).append(new Option(el["name"], el["iso_a2"]));
      });
    },

    error: (xhr) => {
      console.log(xhr["responseText"]);
    },
  });
}

//=============================Get user country by lat and lon=============================//
function getCitiesForCountry(isoCode) {
  $.ajax({
    url: "source/php/getCitiesInCountry.php",
    type: `GET`,
    dataType: `json`,
    data: {
      isoCode: isoCode,
    },
    success: (result) => {
      result["Cities"].forEach((el) => {
        addIcon(el["coords"], el["name"], true);
      });
    },
    error: (xhr) => {
      console.log(xhr["responseText"]);
    },
  });
}

//=============================Get user country by lat and lon=============================//
function getUserLocation(lat, lon) {
  $.ajax({
    url: "source/php/getUserCountry.php",
    type: `GET`,
    dataType: `json`,
    data: {
      lat: lat,
      lon: lon,
    },
    success: (result) => {
      displayInfo(result["name"], result["isoCode"]);
      getCountryBorders(result["isoCode"]);
    },
    error: (xhr) => {
      console.log(xhr["responseText"]);
    },
  });
}

//=============================MAP CREATION=============================//
function createMap() {
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  map.on("click", function () {
    sidebar.hide();
  });
  map.setView([51, 0.1], 6);
  sidebar.toggle();
}

//=============================SEND INFORMATION=============================//
function getCountryBorders(isoCode) {
  // ajax call to get border feature from json file
  $.ajax({
    url: "source/php/getCountryBorders.php",
    type: `GET`,
    dataType: `json`,
    data: {
      countryCode: isoCode,
    },
    success: (result) => {
      addBorders(result["data"]);
    },

    error: (xhr) => {
      console.log(xhr["responseText"]);
    },
  });
}

//=============================ON CHANGE EVENT=============================//
$("#countryList").change(function () {
  if (this.value) {
    $("#news").html("");
    const country = $("#countryList").find(":selected").text();
    const isoCode = this.value;
    // getCitiesForCountry(isoCode);
    getLiveFeed(isoCode);
    // getCountryBorders(isoCode);
    // displayInfo(country, isoCode);
  }
});
//=============================ADD MAP BORDERS=============================//
function addBorders(data) {
  let el = L.geoJson(data, { style: style }).addTo(map);

  var geojson = L.geoJson(data, {
    style: style,
    onEachFeature: onEachFeature,
  }).addTo(map);

  function style() {
    return {
      fillColor: "#A0A0A0", // change this
      weight: 2,
      opacity: 1,
      color: "white",
      fillOpacity: 0.4,
    };
  }

  function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
      weight: 0.5,
      color: "#D3D3D3",
      fillOpacity: 0.3,
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
    sidebar.toggle();
  }

  function onEachFeature(feature, layer) {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature,
    });
  }

  map.fitBounds(el.getBounds());
}

//=============================ADD LIVE FEED=============================//
function getLiveFeed(isoCode) {
  $.ajax({
    url: "source/php/getLiveFeed.php",
    type: `GET`,
    dataType: `json`,
    data: {
      isoCode: isoCode,
    },
    success: (result) => {
      result["webcams"].forEach((el) => {
        let html = `
          <p>${el["name"]}</p>
          <a name="windy-webcam-timelapse-player" data-id="${el["id"]}" data-play="day" href="https://windy.com/webcams/${el["id"]}" target="_blank"></a>
          <script type="text/javascript" src="https://webcams.windy.com/webcams/public/embed/script/player.js"></script>
        `;
        addIcon(el["coords"], html, false);
      });
      console.log(result);
    },

    error: (xhr) => {
      console.log(xhr["responseText"]);
    },
  });
}

//=============================ADD ICONS=============================//
function addIcon(coords, html, type) {
  const icon = L.icon({
    iconUrl: type
      ? "/vendors/leaflet/images/marker-icon.png"
      : "/vendors/leaflet/images/customMarkers/pin.png",
    iconSize: [15, 25],
  });

  L.marker(coords, { icon: icon }).bindPopup(html).addTo(map);
}
//=============================Display Info=============================//
function displayInfo(country, iso) {
  // make call to getInfo php
  $.ajax({
    url: "source/php/getInfo.php",
    type: `GET`,
    dataType: `json`,
    data: {
      country: country,
      countryCode: iso,
    },
    success: (result) => {
      // update with new info
      const wikiInfo = result["wikiExtract"];
      const { desc, humidity, pressure, temperature, wind } = result["weather"];
      const { capital, currency, flag, language, population, region } = result[
        "countryInfo"
      ];

      // get DOM elements to update
      $("#about").html(
        `
          <img src="${flag}" class="img-fluid img-thumbnail" alt="Responsive image">
          <h5 class="text-info">${country}</h5>
          <h6 class="text-info">${capital}</h6>
          <h6 class="text-dark">Language: ${language}</h6>
          <h6 class="text-dark">Region: ${region}</h6>
          <h6 class="text-dark">Currency: ${currency["name"]}(${currency["symbol"]})</h6>
          <h6 class="text-dark">Population: ${population}</h6>
          <p class="wikiInfo">${wikiInfo}</p>
        `
      );
      let d = new Date();
      let weekday = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      $("#weather").html(
        `
          <h5 class="text-info">${capital}</h5>
          <h5 class="text-info">${weekday[d.getDay()]}</h5>
          <h6><img src="https://openweathermap.org/img/w/${
            desc["icon"]
          }.png">${temperature}°C </h6>
          <h6>Humidity: ${humidity}%</h6>
          <h6>Pressure: ${pressure}Pa</h6>
          <h6>Wind Speed: ${wind}knots</h6>
        `
      );
      if (result["news"]) {
        result["news"].forEach((el) => {
          $("#news").append(
            `
                <img src="${
                  el["image"] ? el["image"] : ""
                }" class="img-fluid img-thumbnail" alt="Responsive image">
                <h5 class="text-info">${el["title"]}</h5>
                <p>${el["description"]}</p>
                <a href=${el["url"]} target="_blank">Find out more<a>
            `
          );
        });
      } else {
        $("#news").html("No news for this country");
      }
    },

    error: (xhr) => {
      console.log(xhr["responseText"]);
    },
  });
}
