var atlas = {};

var rectStyle = {
  fill: false,
  color: '#a6bddb',
  weight: 1,
  opacity: 0.5
};

var highlight = {
  color: '#de2d26',
  weight: 5,
  opacity: 0.8
};

function initMap() {
  atlas = L.map('atlas').setView([40, -80], 4);

  L.tileLayer('//stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png').addTo(atlas);
}

function buildMap() {
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
    }).addTo(atlas);
  });
}

function selectMap(mapNumber) {
  var leafletLayer = findLeafletLayer(mapNumber);
  leafletLayer.setStyle(highlight);
  atlas.invalidateSize().fitBounds(leafletLayer.getBounds());
}