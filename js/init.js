var data = {
  maps: {}
};

var selected;

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
    var leafletLayer = findLeafletLayer(mapNumber);
    leafletLayer.setStyle(highlight);
  });
  
  $(document).on('dehighlight:', function(e, mapNumber) {
    if(selected != mapNumber) {
      var leafletLayer = findLeafletLayer(mapNumber);
      leafletLayer.setStyle(rectStyle);
    }
  });

  $(document).on('select:', function(e, mapNumber) {
    if(selected != mapNumber) {
      var old = selected;
      selected = mapNumber;
      $(document).trigger('dehighlight:', old);
      
      showMetadata(data.maps[mapNumber]);
    
      var leafletLayer = findLeafletLayer(mapNumber);
      leafletLayer.setStyle(highlight);
    }
  });
  
  $(document).on('filter:', function() {
    
  });
}

function initUIEvents() {
}