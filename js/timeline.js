var binWidth = 1; //in years
var rectHeight = 6;
var rectWidth = 14;
var padding = 5;
var paddingLeft = 10;
var paddingBottom = 25;
var animDur = 100;
var timeW, timeH;

function buildTimeline() {
  timeW = $('.timeline').width();
  timeH = $('.timeline').height();
  
  //binNum, binnedData, and dateDomain could be simplified, but I'm leaving it in case binWdith changes from a single year
  var binNum = timeW / binWidth;
  var binnedData = _.toArray(_.sortBy(_.groupBy(data.maps, function(v, k) {
    var mod = +v.date % binWidth;
    return +v.date - mod;
  }), function(v) {
    return v.date;
  }));
  var dateDomain = [+binnedData[0][0].date - binWidth*2, +binnedData[binnedData.length-1][0].date + binWidth*2];
  var dateRange = dateDomain[1] - dateDomain[0];
  
  //set the rect height and width based on timeline and data
  rectHeight = Math.max(Math.floor((timeH - paddingBottom) / 8 - 2), 2);
  rectWidth = Math.floor(((timeW / dateRange) - 2) * 0.75);
    
  var t = d3.select('.timeline')
    .append('svg')
    .attr('width', timeW)
    .attr('height', timeH)
    .attr('class', 'timeline--svg')
    .append('g');
    
  var yScale = d3.scale.linear().domain([timeH, 0]).range([0,20]);
  var yAxis = d3.svg.axis().scale(yScale).orient('left');
  
  var xScale = d3.scale.linear().domain(dateDomain).range([padding, timeW - padding*3]);
  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom')
    .ticks(20)
    .tickSize(rectHeight/2)
    .tickFormat(d3.format(".0f"));
    
  d3.select('.timeline--svg').append('g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(' + paddingLeft + ', ' + (timeH - paddingBottom) + ')')
    .call(xAxis);
    
  var dashWidth = Math.round(d3.select('.x-axis').node().getBBox().width / (d3.selectAll('.tick')[0].length - 1) - 2);
  d3.select('.x-axis path').style({
    'stroke-dasharray': function() { return dashWidth; },
    'stroke-width': rectHeight
  });
    
  d3.select('.timeline--svg').append('rect')
    .attr('class', 'x-axis-border')
    .attr('width', timeW - padding * 2)
    .style({
      'height': rectHeight + 'px',
      'stroke-width': rectHeight > 4 ? 2 : 1
    })
    .attr('transform', 'translate(' + paddingLeft + ', ' + (timeH - paddingBottom - (rectHeight/2)) + ')');
    
  var bins = t.selectAll('g.bin')
    .data(binnedData)
    .enter().append('g')
    .attr('class', 'bin')
    .attr('transform', function(d, i) { return 'translate(' + xScale(+d[0].date) + ', 0)' });
  
  bins.selectAll('.timeline--dot')
    .data(function(d) { return d })
    .enter().append('rect')
    .attr('class', 'timeline--dot')
    .attr('width', rectWidth)
    .attr('height', rectHeight)
    .attr('x', binWidth/2)
    .attr('y', function(d, i) { return (timeH - paddingBottom - rectHeight * 2) - i * (rectHeight + 2); })
    .on('mouseover', function(d) { $(document).trigger('highlight:', +d.number) })
    .on('mouseout', function(d) { $(document).trigger('dehighlight:', +d.number) })
    .on('click', function(d) { $(document).trigger('select:', +d.number) });
}

function highlightDot(mapNumber) {
  var dot = d3.selectAll('.timeline--dot')
    .filter(function(d) { return +d.number === mapNumber; })
    .classed('highlight', true);
  
  var bin = dot.node().parentNode;
  d3.select(bin).selectAll('.timeline--dot')
    .transition()
    .duration(animDur)
    .attr('y', function(d, i) {
      //current refers to the dot in this loop
      //highlight refers to the dot in the function - the one being made red
      
      var highlightedY = dot.node().getBBox().y;
      var currentOriginalY = (timeH - paddingBottom - rectHeight * 2) - i * (rectHeight + 2);
      
      var currentAlreadyRed = d3.select(this).classed('highlight');
      var currentWithRedOffset = currentAlreadyRed ? currentOriginalY - rectHeight : currentOriginalY;
      
      var numRed = d3.select(bin).selectAll('.timeline--dot.highlight').size();
      var aboveHighlightWithOffset = currentOriginalY - rectHeight * numRed;
      
      
      if(numRed == 2 && currentOriginalY >= highlightedY ) {
        var redY = d3.selectAll('.timeline--dot.highlight').filter(function(d) { return +d.number !== mapNumber; }).node().getBBox().y;
        if(currentOriginalY < redY) {
          currentWithRedOffset = currentWithRedOffset - rectHeight;
        }
      }
      
      var finalY = currentOriginalY >= highlightedY ? currentWithRedOffset : aboveHighlightWithOffset;
      return finalY;
    })
    .transition()
    .attr('height', function() {
      return d3.select(this).classed('highlight') ? rectHeight * 2 : rectHeight;
    });
}

function dehighlightDot(mapNumber) {
  var dot = d3.selectAll('.timeline--dot')
    .filter(function(d) { return +d.number === mapNumber; })
    .classed('highlight', false);
  
  var bin = dot.node().parentNode;
  d3.select(bin).selectAll('.timeline--dot')
    .transition()
    .duration(animDur)
    .attr('height', function() {
      return d3.select(this).classed('highlight') ? rectHeight * 2 : rectHeight;
    })
    .transition()
    .attr('y', function(d, i) {
       //current refers to the dot in this loop
      //highlight refers to the dot in the function - the one being made red
      
      var highlightedY = dot.node().getBBox().y;
      var currentOriginalY = (timeH - paddingBottom - rectHeight * 2) - i * (rectHeight + 2);
      
      var currentAlreadyRed = d3.select(this).classed('highlight');
      var currentWithRedOffset = currentAlreadyRed ? currentOriginalY - rectHeight : currentOriginalY;
      
      var numRed = d3.select(bin).selectAll('.timeline--dot.highlight').size();
      
      if(numRed == 0) var finalY = currentWithRedOffset;
      else {
        var redY = d3.selectAll('.timeline--dot.highlight').node().getBBox().y;
        if(currentOriginalY < redY) var finalY = currentWithRedOffset - rectHeight;
        else var finalY = currentWithRedOffset;
      }
      return finalY;
    });
}

function filterTimeline() {
  d3.selectAll('g.bin').each(function(d) {
    d3.select(this).selectAll('.timeline--dot')
      .classed({'hidden': true, 'shown': false})
      .filter(function(d) {
        return _.indexOf(_.pluck(data.filtered, 'number'), d.number) == -1 ? false : true;
      })
      .classed({'hidden': false, 'shown': true})
      .attr('y', function(d, i) { return (timeH - paddingBottom - rectHeight * 2) - i * (rectHeight + 2); });
  });
}