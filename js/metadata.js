function buildMetadata(map) {
  if(!$('.metadata').is(':visible')) $('.metadata').show();
  
  $('.metadata--title').text(map.title);
}