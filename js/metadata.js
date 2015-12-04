function buildMetadata(map) {
  if(!$('.metadata').is(':visible')) $('.metadata').animate({width:'toggle'}, 'fast');
  
  $('.metadata--title').text(map.title);
}