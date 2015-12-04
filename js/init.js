var data = {
  maps: {}
};

var selected = 0;

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
    buildTimeline();
  });
}

function initCustomEvents() {
  $(document).on('highlight:', function(e, mapNumber) {
    var leafletLayer = findLeafletLayer(mapNumber);
    leafletLayer.setStyle(highlight);
    
    $('.map-list--link[data-number=' + mapNumber + ']').addClass('selected');
    
    highlightDot(mapNumber);
  });
  
  $(document).on('dehighlight:', function(e, mapNumber) {
    if(selected != mapNumber) {
      var leafletLayer = findLeafletLayer(mapNumber);
      leafletLayer.setStyle(rectStyle);
      
      $('.map-list--link[data-number=' + mapNumber + ']').removeClass('selected');
      
      dehighlightDot(mapNumber);
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
      atlas.fitBounds(leafletLayer.getBounds());
      
      $('.map-list--link[data-number=' + mapNumber + ']').addClass('selected');
      
      highlightDot(mapNumber);
    }
  });
  
  $(document).on('filter:', function() {
    
  });
}

function initUIEvents() {
}