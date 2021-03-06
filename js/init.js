var data = {
  maps: {},
  filtered: {}
};

var filters = [];
var selected = 0;

$(document).ready(function() {
  initData();
});

function init() {
  initMap();
  initCustomEvents();
  initUIEvents();

  drawMap();
  drawMapList();
  buildTimeline();
  buildSearch();
}

function initData() {
  $.get('data/maps.csv', function(m) {
    data.maps = _.indexBy( Papa.parse( m, { header: true } ).data, "number" );
    data.filtered = data.maps;
    
    init();
  });
}

function initCustomEvents() {
  $(document).on('highlight:', function(e, mapNumber) {
    if(selected !== mapNumber) {
      var leafletLayer = findLeafletLayer(mapNumber);
      if(leafletLayer) leafletLayer.setStyle(highlight);
      
      $('.map-list--link[data-number=' + mapNumber + ']').addClass('selected').prev().css('visibility', 'visible');
      
      highlightDot(mapNumber);
    }
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
      
      selected = mapNumber;
      
      $(document).trigger('highlight:', mapNumber);
          
      buildMetadata(data.filtered[mapNumber]);
    
      atlas.removeLayer(mapLayer);
      selectMap(mapNumber);
      
      $('.map-list--link.selected')
        .prev().css('background-image', 'url("img/fleur-symbol-selected.png")');
    }
  });
  
  $(document).on('deselect:', function(e) {
    if(selected !== 0) {
      var old = selected;
      selected = 0;
      
      atlas.addLayer(mapLayer).removeLayer(histLayer);
      
      $(document).trigger('dehighlight:', old);
      
      $('.metadata').hide();
      $('.atlas--border').removeClass('atlas--border-right');
      $('.map-list--link.selected')
        .removeClass('selected')
        .prev().css('background-image', 'url("img/fleur-symbol.png")');      
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
    
    drawMapList();
    drawMap();
    filterTimeline();
  });
}

function initUIEvents() {
  $('.js-about--close').click(function() {
    $('.modal').hide();
  });
  
  $(document).on('keydown', function(e) {
    if(e.keyCode == 27) $('.modal').hide();
  });
}