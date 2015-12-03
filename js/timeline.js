function buildTimeline() {
  console.log(data.maps);
  
  var tData = _.toArray(data.maps);
  console.log(tData);
  var bins = 1200 / 12;
  
  // var x = d3.scale.linear()
    // .domain([1600, 1900])
    // .range([0, 1200]);
    
  // var hData = d3.layout.histogram()
    // .bins(x.ticks(bins))
    // (tData);
    
  // var y = d3.scale.linear()
    // .domain([0, d3.max(hData, function(d) { return d.y; })])
    // .range([100, 0]);
    
  // var xAxis = d3.svg.axis()
    // .scale(x)
    // .orient('bottom');
  
  
  
  
  var t = d3.select('.timeline')
    .append('svg')
    .style('border', '1px solid')
    .attr('width', '1200px')
    .attr('height', '100px')
    .attr('class', 'timeline--svg')
    .append('g');
    
  var yScale = d3.scale.linear().domain([100, 0]).range([0,20]);
  var yAxis = d3.svg.axis().scale(yScale).orient('left');
  
  var xScale = d3.scale.linear().range([0,1200]).domain([1600,1900]);
  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom')
    .ticks(bins/10)
    .tickSize(5)
    .tickFormat(d3.format(".0f"));
    
  d3.select('.timeline--svg').append('g')
    .attr('class', 'x-axis')
    .call(xAxis);
  
  t.selectAll('.dot')
    .data(tData)
    .enter().append('circle')
    .attr('class', 'timeline--dot')
    .attr('r', 5)
    .attr('cx', function(d) { return xScale(parseInt(d.date)); })
    .attr('cy', function(d, i) { return i; })
    .style('fill', 'black');
}