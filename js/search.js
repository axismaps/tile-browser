function buildSearch() {
  $('.search--bar').on('keydown', function(e) {
    if(e.keyCode == 13) {
      var value = $(this).val().trim();
      
      if(value !== '') {
        if(value.indexOf(' ') >= 0) {
          value = value.split(' ');
          value.forEach(function(v) {
            filters.push(v);
            addSearchTerm(v);
          });
        } else {
          filters.push(value);
          addSearchTerm(value);
        }
        
        $(document).trigger('filter:');
        $('.search--bar').val('');
      }
    }
  });
}

function addSearchTerm(v) {
  var termSpan = $('<span>')
    .addClass('search--textTerm')
    .text(v);
    
  var closeSpan = $('<span>')
    .addClass('search--closeTerm')
    .html('<i class="icon-cancel-circled"></i>')
    .on('click', function() {
      filters = _.without(filters, $(this).prev().text());
      $(this).parent().remove();
      $(document).trigger('filter:');
    });
    
  var term = $('<div>')
    .addClass('search--term')
    .append(termSpan)
    .append(closeSpan);
  
  if($('.search--term').length > 0) $('.search--term').last().after(term);
  else $('.search--container').prepend(term);
}