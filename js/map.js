var atlas = {};
var mapLayer;
var histLayer;
// var histTileURL = '';
var histTileURL = 'http://bpl-maps2.s3-website-us-east-1.amazonaws.com/';
// var histTileURL = 'http://www.zoominginonhistory.com/tiles/';

var rectStyle = {
  fill: false,
  color: '#a6bddb',
  weight: 3,
  opacity: 0.5
};

var highlight = {
  color: '#de2d26',
  weight: 5,
  opacity: 0.8
};

function initMap() {
  atlas = L.map('atlas').setView([40, -80], 4);

  L.tileLayer('//stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png', {
    attribution: 'Basemap tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under ODbL'
  }).addTo(atlas);
  
  mapLayer = L.featureGroup().addTo(atlas);
}

function drawMap() {
  mapLayer.eachLayer(function(layer) {
    mapLayer.removeLayer(layer);
  });
  
  _.each(data.filtered, function(map) {
    var options = {
      className: 'atlas--map-area',
      fill: false
    };
    
    var rect = L.rectangle([
      [map.bottom, map.left],
      [map.top, map.right]
    ]).toGeoJSON();
    
    rect.properties = {
      number: +map.number
    }

    L.geoJson(rect, {
      style: function(f) {
        return rectStyle
      },
      onEachFeature: function(f, l) {
        l.on({
          click: function() { $(document).trigger('select:', f.properties.number) },
          mouseover: function() { $(document).trigger('highlight:', f.properties.number) },
          mouseout: function() { $(document).trigger('dehighlight:', f.properties.number) }
        });
      }
    }).addTo(mapLayer);
  });
}

function selectMap(mapNumber) {
  var leafletLayer = findLeafletLayer(mapNumber);
  leafletLayer.setStyle(highlight);
  atlas.invalidateSize().fitBounds(leafletLayer.getBounds());
  
  if(histLayer) atlas.removeLayer(histLayer);
  
  var histBounds = [
    [data.maps[mapNumber].bottom, data.maps[mapNumber].left],
    [data.maps[mapNumber].top, data.maps[mapNumber].right]
  ];
  
  histLayer = L.tileLayer( histTileURL + "tiles/" + mapNumber + "/{z}/{x}/{y}.png", {
		tms : true,
    bounds: histBounds,
    minZoom: data.maps[mapNumber].minZoom,
		maxZoom: data.maps[mapNumber].maxZoom,
		maxNativeZoom: data.maps[mapNumber].maxZoom
	} ).addTo(atlas);
}