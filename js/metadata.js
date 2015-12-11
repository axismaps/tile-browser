var mdmap;

function buildMetadata(map) {
  if(!$('.metadata').is(':visible')) {
    $('.metadata').show();
    $('.atlas--border').addClass('atlas--border-right');
  }
  
  $('.metadata--close').off().on('click', function() { $(document).trigger('deselect:'); });
  
  $('.metadata--header').text(map.title);
  
  _.each(map, function(v, k) {
    if($('.metadata--' + k).length > 0) $('.metadata--' + k + ' .metadata--item').empty().text(map[k]);
  });
  
  /* Metadata inset map */
  if(!mdmap) {
    mdmap = L.map('metadata--map', {
      dragging: false,
      touchZoom: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      zoomControl: false,
      attributionControl: false
    });
    
    L.mapboxGL({
      accessToken: mapboxAccessToken,
      style: mapboxTiles
    }).addTo(mdmap);
  }
  
  mdmap.fitBounds([[map.bottom, map.left], [map.top, map.right]]);
  if(map.minZoom < 9) mdmap.setZoom(map.minZoom);
  else mdmap.setZoom(9);
  
  mdmap.eachLayer(function(v) {
    if(v.feature) mdmap.removeLayer(v);
  });
  var rect = L.rectangle([
    [map.bottom, map.left],
    [map.top, map.right]
  ]).toGeoJSON();

  L.geoJson(rect, {
    style: function(f) {
      return highlight;
    }
  }).addTo(mdmap);
}