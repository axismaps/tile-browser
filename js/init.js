var data = {
  maps: {},
  filtered: {}
};

var filters = [];
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
    console.log(data.maps);
    data.filtered = data.maps;
    drawMap();
    drawMapList();
    buildTimeline();
    buildSearch();
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
    if(selected !== mapNumber && mapNumber !== 0) {
      var leafletLayer = findLeafletLayer(mapNumber);
      leafletLayer.setStyle(rectStyle);
      
      $('.map-list--link[data-number=' + mapNumber + ']').removeClass('selected');
      
      dehighlightDot(mapNumber);
    }
  });

  $(document).on('select:', function(e, mapNumber) {
    if(selected !== mapNumber) {
      var old = selected;
      selected = mapNumber;
      $(document).trigger('dehighlight:', old);
      
      buildMetadata(data.filtered[mapNumber]);
    
      selectMap(mapNumber);
      $('.map-list--link[data-number=' + mapNumber + ']').addClass('selected');
      highlightDot(mapNumber);
    }
  });
  
  $(document).on('deselect:', function(e) {
    var leafletLayer = findLeafletLayer(selected);
    leafletLayer.setStyle(rectStyle);
    
    $('.metadata').hide();
    $('.map-list--link.selected').removeClass('selected');
    dehighlightDot(selected);
    
    atlas.removeLayer(histLayer).invalidateSize();
    
    selected = 0;
  });
  
  $(document).on('filter:', function() {
    $(document).trigger('deselect:');
    
    //reset filter
    if(filters.length > 0) {
      data.filtered = _.pick(data.maps, function(map) {
        return _.find(map, function(v) {
          return _.every(filters, function(filter) {
            return v.toLowerCase().indexOf(filter.toLowerCase()) >= 0;
          });
        }) ? true : false;
      });
    } else data.filtered = data.maps;
    
    console.log(data.filtered);
    
    drawMapList();
    drawMap();
    filterTimeline();
  });
}

function initUIEvents() {
}