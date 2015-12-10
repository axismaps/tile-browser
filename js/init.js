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
    if(leafletLayer) leafletLayer.setStyle(highlight);
    
    $('.map-list--link[data-number=' + mapNumber + ']').addClass('selected').prev().css('visibility', 'visible');
    
    highlightDot(mapNumber);
  });
  
  $(document).on('dehighlight:', function(e, mapNumber) {
    if(selected !== mapNumber && mapNumber !== 0) {
      var leafletLayer = findLeafletLayer(mapNumber);
      if(leafletLayer) leafletLayer.setStyle(rectStyle);
      
      $('.map-list--link[data-number=' + mapNumber + ']').removeClass('selected').prev().css('visibility', 'hidden');
      
      dehighlightDot(mapNumber);
    }
  });

  $(document).on('select:', function(e, mapNumber) {
    if(selected !== mapNumber) {
      $(document).trigger('deselect:');
          
      buildMetadata(data.filtered[mapNumber]);
    
      atlas.removeLayer(mapLayer);
      selectMap(mapNumber);
      
      $('.map-list--link[data-number=' + mapNumber + ']')
        .addClass('selected')
        .prev().css({
          'visibility': 'visible',
          'background-image': 'url("img/fleur-symbol-selected.png")'
        });
      highlightDot(mapNumber);
      
      selected = mapNumber;
    }
  });
  
  $(document).on('deselect:', function(e) {
    if(selected !== 0) {
      $('.metadata').hide();
      $('.atlas--border').removeClass('atlas--border-right');
      $('.map-list--link.selected')
      .removeClass('selected')
      .prev().css({
          'visibility': 'hidden',
          'background-image': 'url("img/fleur-symbol.png")'
        });
      dehighlightDot(selected);
      
      atlas.addLayer(mapLayer).removeLayer(histLayer);
      var leafletLayer = findLeafletLayer(selected);
      if(leafletLayer) leafletLayer.setStyle(rectStyle);
      
      selected = 0;
    }
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
  $('.about--close').click(function() {
    $('.modal').hide();
  });
}