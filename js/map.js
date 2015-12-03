var atlas = {};

function initMap() {
  atlas = L.map('atlas').setView([40, -100], 4);

  L.tileLayer('//stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png').addTo(atlas);
}

function buildMap() {
  console.log(data.maps);
  _.each(data.maps, function(map) {
    var options = {
      className: 'atlas--map-area',
      fill: false
    };
    
    L.rectangle([
      [map.bottom, map.left],
      [map.top, map.right]
    ], options)
      .addTo(atlas)
      .on('mouseover', function() { $(document).trigger('highlight:', this) })
      .on('click', function() { $(document).trigger('select:', this) });
  });
}