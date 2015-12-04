function buildSearch() {
  $('.search--bar').on('keydown', function(e) {
    if(e.keyCode == 13) {
      var value = $(this).val();
      $(document).trigger('filter:', value);
      
      addSearchTerm(value);
      console.log('adjust width');
      $(this)
        .width($(this).width() - $('.search--term').last().width() - 10)
        .val('');
    }
  });
}

function addSearchTerm(v) {
  var span = $('<span>')
    .addClass('search--term')
    .text(v)
  
  if($('.search--term').length > 0) $('.search--term').last().after(span);
  else $('.search--container').prepend(span);
}