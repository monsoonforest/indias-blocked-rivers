// Edit the center point and zoom level
var map = L.map('map', {
  center: [20.34, 77.89],
  zoom: 5  ,
  minZoom : 5,
  scrollWheelZoom: true
});


// layer controls
var controlLayers = L.control.layers( null, null, {
     position:"topleft",
     collapsed: true // truw = closed by default
    }).addTo(map);

// new L.tileLayer('https://{s}.tile.thunderforest.com/mobile-atlas/{z}/{x}/{y}.png', {
//   attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//   ,var positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
//         attribution: '©OpenStreetMap, ©CartoDB'
// }).addTo(map);


// Edit links to your GitHub repo and data source credit
map.attributionControl.addAttribution('View <a href="https://github.com/monsoonforest/indias-blocked-rivers/">open-source code on GitHub</a>');
map.attributionControl.addAttribution('Data &copy; <a href="https://indiawris.gov.in/wris/#/waterResources">Gov. of India </a>');


new L.esri.basemapLayer('Imagery').addTo(map);
new L.esri.basemapLayer('ImageryLabels').addTo(map);


$.getJSON("dams_wri_table_20220331.geojson", function (data) {
  geoJsonLayer = L.geoJson(data, {
    style: {color: '#ff0000', weight:1.5},
       onEachFeature: onEachFeature

  }).addTo(map);
controlLayers.addOverlay(geoJsonLayer, 'Dams');
});

$.getJSON("barrages_wri_table_20220331.geojson", function (data) {
  geoJsonLayer = L.geoJson(data, {
    style: {color: '#ffa500', weight:1.5},
       onEachFeature: onEachFeature

  }).addTo(map);
controlLayers.addOverlay(geoJsonLayer, 'Barrages');
});

for (var num = 0; num < barrages.name; num++) {
	// Grab information on the brewery we are currently looping through
	var barrages = barrages[num];
	var barrages_lat = barrages["Latitude"];
	var barrages_long = barrages["Longitude"];
	var barrages_name = barrages["barrages"];
	var barrages_state = barrages["State"];
	var barrages_river = barrages["River"];
	var barrages_year = barrages["Year_of_Completion"];

	// Use Leaflet to add a marker for each brewery
	// And give it the lat, long information
	// In the current brewery's object
	var marker = L.marker([brewery_lat, brewery_long]).addTo(map);
	
	// HTML that will appear in popup
	var popup_html = '<h3>' + brewery_name + '</h3>';
	popup_html += '<div>' + brewery_state + '</div>';
	popup_html += '<div>' + brewery_river + '</div>';
    popup_html += '<div>' + brewery_year + '</div>';
	
	// Bind the popup to the marker using Leaflet
	marker.bindPopup(popup_html);
}