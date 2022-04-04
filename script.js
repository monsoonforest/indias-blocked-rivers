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

// $.getJSON("arunachal-pradesh-districts.geojson", function (data) {
//   geoJsonLayer = L.geoJson(data, {
//     style: {color: '#42ff3f', weight:1, fillOpacity: 0}
//   }).addTo(map);
// });


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



// This highlights the layer on hover, also for mobile
function highlightFeature(e) {
  resetHighlight(e);
  var layer = e.target;
  layer.setStyle({
    weight: 4,
    color: 'red',
    fillOpacity: 0
  });
  info.update(layer.feature.properties);
}

// This resets the highlight after hover moves away
function resetHighlight(e) {
  geoJsonLayer.setStyle(style);
  info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

// This instructs highlight and reset functions on hover movement
function onEachFseature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: highlightFeature,
    click: zoomToFeature
  });
}


// Creates an info box on the map
var info = L.control();
info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
};

// Edit info box text and variables (such as elderly density 2014) to match those in your GeoJSON data
info.update = function (props) {
  this._div.innerHTML = '<h4>Dams and Barrages of India</h4>' +  (props ?
    '<b>' + props.name + '</b><br />' + props.State + '</b><br />' + props.River + '</b><br />'+ props.Basin + '</b><br />' + props.Year_of_Completion

    : 'Click on a Feature');
};  


info.addTo(map);

// Edit grades in legend to match the ranges cutoffs inserted above
// In this example, the last grade will appear as 50+
var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend'),
    lower = [3, 15, 25, 35, 65],
    upper = [15, 25, 35, 65, 110],
    labels = ['<strong> Senior Citizens <br /> Per Polling Station </strong>'],
    from, to;
  for (var i = 0; i < lower.length; i++) {
        labels.push(
            '<i style="background:' + getColor(lower[i] + 1) + '"></i> ' +
            lower[i] + '&ndash;' + upper[i]);
   }
    div.innerHTML = labels.join('<br>');
    return div;
};
legend.addTo(map);

// Use in info.update if GeoJSON data contains null values, and if so, displays "--"
function checkNull(val) {
  if (val != null || val == "NaN") {
    return comma(val);
  } else {
    return "--";
  }
}

// Use in info.update if GeoJSON data needs to be displayed as a percentage
function checkThePct(a,b) {
  if (a != null && b != null) {
    return Math.round(a/b*1000)/10 + "%";
  } else {
    return "--";
  }
}

// Use in info.update if GeoJSON data needs to be displayed with commas (such as 123,456)
function comma(val){
  while (/(\d+)(\d{3})/.test(val.toString())){
    val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
  }
  return val;
}
