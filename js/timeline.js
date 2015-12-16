var binWidth = 1; //in years
var rectHeight = 6;
var rectWidth = 14;
var padding = 5;
var paddingLeft = 10;
var paddingBottom = 25;

function buildTimeline() {
  var w = $('.timeline').width();
  var h = $('.timeline').height();
  
  //binNum, binnedData, and dateDomain could be simplified, but I'm leaving it in case binWdith changes from a single year
  var binNum = w / binWidth;
  var binnedData = _.toArray(_.sortBy(_.groupBy(data.maps, function(v, k) {
    var mod = +v.date % binWidth;
    return +v.date - mod;
  }), function(v) {
    return v.date;
  }));
  var dateDomain = [+binnedData[0][0].date - binWidth*2, +binnedData[binnedData.length-1][0].date + binWidth*2];
  var dateRange = dateDomain[1] - dateDomain[0];
  
  //set the rect height and width based on timeline and data
  rectHeight = Math.max(Math.floor((h - paddingBottom) / 8 - 2), 2);
  rectWidth = Math.floor(((w / dateRange) - 2) * 0.75);
    
  var t = d3.select('.timeline')
    .append('svg')
    .attr('width', w)
    .attr('height', h)
    .attr('class', 'timeline--svg')
    .append('g');
    
  var yScale = d3.scale.linear().domain([h, 0]).range([0,20]);
  var yAxis = d3.svg.axis().scale(yScale).orient('left');
  
  var xScale = d3.scale.linear().domain(dateDomain).range([padding, w - padding*3]);
  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom')
    .ticks(20)
    .tickSize(rectHeight/2)
    .tickFormat(d3.format(".0f"));
    
  d3.select('.timeline--svg').append('g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(' + paddingLeft + ', ' + (h - paddingBottom) + ')')
    .call(xAxis);
    
  var dashWidth = Math.round(d3.select('.x-axis').node().getBBox().width / (d3.selectAll('.tick')[0].length - 1) - 2);
  d3.select('.x-axis path').style({
    'stroke-dasharray': function() { return dashWidth; },
    'stroke-width': rectHeight
  });
    
  d3.select('.timeline--svg').append('rect')
    .attr('class', 'x-axis-border')
    .attr('width', w - padding * 2)
    .style({
      'height': rectHeight + 'px',
      'stroke-width': rectHeight > 4 ? 2 : 1
    })
    .attr('transform', 'translate(' + paddingLeft + ', ' + (h - paddingBottom - (rectHeight/2)) + ')');
    
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
    .attr('y', function(d, i) { return (h - paddingBottom - rectHeight * 2) - i * (rectHeight + 2); })
    .on('mouseover', function(d) { $(document).trigger('highlight:', +d.number) })
    .on('mouseout', function(d) { $(document).trigger('dehighlight:', +d.number) })
    .on('click', function(d) { $(document).trigger('select:', +d.number) });
}

function highlightDot(mapNumber) {
  var dot = d3.selectAll('.timeline--dot')
    .filter(function(d) {
      return +d.number === mapNumber;
    })
    .classed('highlight', true)
    .attr('y', function() { return d3.select(this).node().getBBox().y - rectHeight; })
    .attr('height', rectHeight * 2);
    
  var yPosition = dot.node().getBBox().y;
    
  var bin = dot.node().parentNode;
  d3.select(bin).selectAll('.timeline--dot')
    .each(function() {
      d3.select(this).attr('y', function() {
        var y = d3.select(this).node().getBBox().y;
        return y >= yPosition ? y : y - rectHeight; 
      });
    });
}

function dehighlightDot(mapNumber) {
  var dot = d3.selectAll('.timeline--dot')
    .filter(function(d) {
      return +d.number === mapNumber;
    })
    .classed('highlight', false)
    .attr('y', function() { return d3.select(this).node().getBBox().y + rectHeight; })
    .attr('height', rectHeight);
    
  var yPosition = dot.node().getBBox().y;
    
  var bin = dot.node().parentNode;
  d3.select(bin).selectAll('.timeline--dot')
    .each(function() {
      d3.select(this).attr('y', function() { 
        var y = d3.select(this).node().getBBox().y;
        return y >= yPosition ? y : y + rectHeight; 
      });
    });
}

function filterTimeline() {
  var h = $('.timeline--svg').height();
      
  d3.selectAll('g.bin').each(function(d) {
    d3.select(this).selectAll('.timeline--dot')
      .classed({'hidden': true, 'shown': false})
      .filter(function(d) {
        return _.indexOf(_.pluck(data.filtered, 'number'), d.number) == -1 ? false : true;
      })
      .classed({'hidden': false, 'shown': true})
      .attr('y', function(d, i) { return (h - paddingBottom - rectHeight * 2) - i * (rectHeight + 2); });
  });
}