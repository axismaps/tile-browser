var atlas = {};

var rectStyle = {
  fill: false,
  color: '#a6bddb',
  weight: 1
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
  console.log(data.maps);
  _.each(data.maps, function(map) {
    var options = {
      className: 'atlas--map-area',
      fill: false
    };
    
    var rect = L.rectangle([
      [map.bottom, map.left],
      [map.top, map.right]
    ]).toGeoJSON();
    
    rect.properties = {
      number: parseInt(map.number)
    }

    L.geoJson(rect, {
      style: function(f) {
        return rectStyle
      },
      onEachFeature: function(f, l) {
        l.on({
          click: function() { $(document).trigger('select:', f.properties.number) },
          mouseover: function() { $(document).trigger('highlight:', f.properties.number) }
        });
      }
    }).addTo(atlas);
  });
}