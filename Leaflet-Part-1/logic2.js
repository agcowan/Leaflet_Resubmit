
// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2022-07-06&endtime=2022-07-07";


d3.json(queryUrl).then(function(data){

  function createFeatures(earthquakeData) {

    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    // function onEachFeature(feature, layer) {
    //   layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><hr><p>${feature.properties.mag}</p>`);
    // }

    function getColor(magnitude){
      var color = "";

      //long if-else statement based on magnitude
      if(magnitude > 5) {
        color = "#ED1717"
      } else if(magnitude > 4) {
        color = "#F24D11"
      } else if(magnitude > 3) {
        color = "#F6830C"
      } else if(magnitude > 2) {
        color = "#FBB806"
      } else if(magnitude > 1){
        color = "#FFEE00"
      } else {
        color = "#00FF00"
      }
      return color;
    }


    // Create the style data for the earthquakes represented by circles. Passing the magnitude of each to calculate the radius
    function circleStyle(color,radius) {
      return {
        color:color,
        opacity: 1,
        fillOpacity: .8,
        fillColor: color,
        radius: radius,
        stroke: true,
        weight: 1
      };
    }

    // Create the circles of each earthquake
    


    // draw the circle for the earthquake based on the magnitude
    function getRadius(magnitude) {
      if (magnitude === 0) {
        return 1;
      }
      return magnitude * 5
    }

    

    L.geoJSON(earthquakeData, { //
      // onEachFeature: onEachFeature,
      pointToLayer: function createCircles(feature){
        console.log(feature)
        magnitude = feature.properties.mag; //*********************
        var radius = getRadius(magnitude);
        var color = getColor(magnitude);
        var latlng = L.latLng([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]) //
        return L.circleMarker(latlng, circleStyle(color,radius));
      } //*********************
    }).addTo(myMap);

    

    

    
    // Map object, centered with default layers
    

    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

    // Add legend here********************
  }


  // Perform a GET request to the query URL

    // Once we get a response, send the data.features object to the createFeatures function.
    console.log(data.features[0].geometry.coordinates[1])
    createFeatures(data.features); //***********************
}); 

var myMap = L.map("map", {
  center: [
    37.09, -95.71
  ],
  zoom: 3,
  // layers: [topo, earthquakes]
});

// Topographical map layer
var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
})
topo.addTo(myMap)

// Earthquake variable
var earthquakes = L.layerGroup();
earthquakes.addTo(myMap)

// Street map layer
var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

// Base layer that holds both
var baseMaps = {
  "Topographic Map": topo,
  "Street Map": street
};

var overlayMaps = {
  "Earthquakes":earthquakes
};
