function showMetadata(map) {
  if(!$('.metadata').is(':visible')) $('.metadata').animate({width:'toggle'}, 'slow');
  
  $('.metadata--title').text(map.title);
}