function buildMetadata(map) {
  if(!$('.metadata').is(':visible')) $('.metadata').show();
  
  $('.metadata--header').text(map.title);
  
  
  _.each(map, function(v, k) {
    if($('.metadata--' + k).length > 0) $('.metadata--' + k + ' .metadata--item').empty().text(map[k]);
  });
  
}