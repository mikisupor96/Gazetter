//=============================LOAD ON DOCUMENT READY=============================//
$(document).ready(function () {
  //=============================GET CURRENT POSITION=============================//
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function success(pos) {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;

    map.setView([lat, lon], 9);
    L.marker([lat, lon])
      .addTo(map)
      .on("click", function () {
        sidebar.toggle();
      });
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  navigator.geolocation.getCurrentPosition(success, error, options);
  //=============================ADD COUNTRIES=============================//
  $.ajax({
    url: "source/php/getCountry.php",
    type: `POST`,
    dataType: `json`,
    success: (result) => {
      if (result.status.name === "ok") {
        result["data"].forEach((el) => {
          $(`#countryList`).append(new Option(el["name"], el["iso_a2"]));
        });
      }
    },

    error: (err) => {
      return err;
    },
  });
});
//=============================MAP CREATION=============================//
const map = L.map("map");

L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
  attribution: "Map data &copy; OpenStreetMap contributors",
}).addTo(map);

const sidebar = L.control.sidebar("sidebar", {
  closeButton: true,
  position: "left",
});
map.addControl(sidebar);

setTimeout(function () {
  sidebar.show();
}, 500);

map.on("click", function () {
  sidebar.hide();
});

// info button
var button = new L.Control.Button("Show Map");
button.addTo(map);
button.on("click", function () {
  sidebar.toggle();
});

//=============================SEND INFORMATION=============================//
function getCountryBorders(isoCode) {
  // ajax call to get border feature from json file
  $.ajax({
    url: "source/php/getCountryBorders.php",
    type: `POST`,
    dataType: `json`,
    data: {
      countryCode: isoCode,
    },
    success: (result) => {
      // console.log(result["data"])
      addBorders(result["data"]);
    },

    error: (err) => {
      console.log(err);
    },
  });
}
//=============================ON CHANGE EVENT=============================//
$("#countryList").change(function () {
  if (this.value) {
    const country = $("#countryList").find(":selected").text();
    const iso = this.value;
    getCountryBorders(iso);
    displayInfo(country, iso);
  }
});
//=============================ADD MAP BORDERS=============================//
function addBorders(data) {
  let el = L.geoJson(data, { style: style }).addTo(map);

  var geojson = L.geoJson(data, {
    style: style,
    onEachFeature: onEachFeature,
  }).addTo(map);

  function getColor(d) {
    return d > 1000
      ? "#800026"
      : d > 500
      ? "#BD0026"
      : d > 200
      ? "#E31A1C"
      : d > 100
      ? "#FC4E2A"
      : d > 50
      ? "#FD8D3C"
      : d > 20
      ? "#FEB24C"
      : d > 10
      ? "#FED976"
      : "#FFEDA0";
  }

  function style(feature) {
    return {
      fillColor: getColor(feature.properties.density), // change this
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
//=============================Display Info=============================//
function displayInfo(country, iso) {
  // make call to getInfo php
  $.ajax({
    url: "source/php/getInfo.php",
    type: `POST`,
    dataType: `json`,
    data: {
      country: country,
      countryCode: iso,
    },
    success: (result) => {
      console.log(result);
      // update with new info
      const wikiInfo = result["wikiExtract"];
      const { description, humidity, rain, temp } = result["weather"];
      // get DOM elements to update
      $("#about").html(
        `
          <h1 class = "text-info">${country}</h1>
          <p class="wikiInfo">${wikiInfo}</p>
        `
      );
      $("#weather").html(
        `<h5 class="text-info">${temp}°C | ${humidity}%rh | ${description} | ${
          rain ? `No rain` : `Rain`
        }</h5>`
      );
      if (result["news"]) {
        let newsArticle = {
          title: result["news"]["title"][0],
          content: result["news"]["content"][0]
            .split(".")
            .splice(0, 2)
            .join(" "),
        };
        $("#news").html(
          `
            <div>
              <h5 class="text-info">${newsArticle["title"]}</h5>
              <p>${newsArticle["content"]}</p>
            </div>
          `
        );
      } else {
        $("#news").html(
          `
            <h5 class="text-info">No news</h5>
            `
        );
      }
    },

    error: (err) => {
      console.log(err);
    },
  });
}
