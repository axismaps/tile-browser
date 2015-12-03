var atlas = {};

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
        return {
          fill: false,
          className: 'atlas--map-area'
        }
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