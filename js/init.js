$(document).ready(function() {
  initMap();
  initCustomEvents();
  initUIEvents();
});

function initCustomEvents() {
  
}

function initUIEvents() {
  $('.js-metadata-btn').on('click', function() {
    $('.metadata').animate({width: 'toggle'}, 'slow');
  });
}