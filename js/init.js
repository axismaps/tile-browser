var data = {
  maps: {}
};

$(document).ready(function() {
  initData();
  initMap();
  initCustomEvents();
  initUIEvents();
});

function initData() {
  $.get('data/maps.csv', function(m) {
    data.maps = _.indexBy( Papa.parse( m, { header: true } ).data, "number" );
    buildMap();
    buildMapList();
  });
}

function initCustomEvents() {
  $(document).on('highlight:', function(e, mapNumber) {
    // console.log(mapNumber);
    var leafletLayer = findLeafletLayer(mapNumber);
    leafletLayer.setStyle(highlight);
    console.log(leafletLayer);
  });

  $(document).on('select:', function(e, mapNumber) {
    showMetadata(data.maps[mapNumber]);
  });
  
  $(document).on('filter:', function() {
    
  });
}

function initUIEvents() {
}