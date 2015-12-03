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
  $(document).on('highlight:', function() {
    
  });

  $(document).on('select:', function(e, map) {
    showMetadata(map);
  });
  
  $(document).on('filter:', function() {
    
  });
}

function initUIEvents() {
  $('.js-metadata-btn').on('click', function() {
    $('.metadata').animate({width: 'toggle'}, 'slow');
  });
}