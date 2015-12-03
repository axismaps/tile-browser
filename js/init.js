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
  
}

function initUIEvents() {
  $('.js-metadata-btn').on('click', function() {
    $('.metadata').animate({width: 'toggle'}, 'slow');
  });
}