//Resource for formatting style of title: http://bl.ocks.org/d3noob/a22c42db65eb00d4e369
//Resource for using timeParse: https://stackoverflow.com/questions/32428122/what-scale-to-use-for-representing-years-only-on-x-axis-in-d3-js

document.addEventListener('DOMContentLoaded',function(){
  req=new XMLHttpRequest();
  req.open("GET",'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json',true);
  req.send();
  req.onload=function(){
    json=JSON.parse(req.responseText);
   
//1. Manage the data
    
    var parseDate = d3.timeParse('%Y')
    var data = []
    var times = []
    
    //Populate data and times arrays
    json.forEach(function(val){
      data.push([val.Year, parseDate(val.Year), val.Time, val.Name, val.Nationality, val.Doping])
      times.push(val.Time.split(":"))
    })
   //turn racetimes into SECONDS, and add to data array
   for(var i=0; i<data.length; i++){
      data[i].push((times[i][0]*60 + Number(times[i][1])))
    }
    

//2. Create the graph using D3
    
    //Set dimensions of the canvas
    const w = 800;
    const h = 500;
    const padding = 50;
    
    //Scale for x-axis (years)
    const xScale = d3.scaleTime()
                     .domain([d3.min(data, d => d[1]), d3.max(data, d => d[1])]) 
                     .range([padding+10, w-padding+10]); 
    
    //Scale for y-axis (seconds), in reverse order
    //Note: domain min hard-coded to ensure axis begins at :30, not a random time
    const yScale = d3.scaleLinear()
                     .domain([d3.max(data, d => d[6]), d3.min(data, d => d[6]-20)])
                     .range([h-padding, padding])
    
    //Define the axes
    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale)
                     //Note: range min hard-coded to ensure axis begins at :30
                    .tickValues(d3.range(d3.min(data, d => d[6])-20, d3.max(data, d=>d[6]),15))
                    //Convert seconds back into minutes for tick marks.
                    .tickFormat(function (s){ 
                       var minutes = Math.floor(s/60)
                       var seconds = s - (minutes * 60)
                       //return minutes + ":" + seconds
                      if (seconds === 0){
                        return minutes + ":00"
                      } return minutes + ":" + seconds
                  })
                    
    // Define the div for the tooltip
    var div = d3.select("a").append("div")	
                .attr("class", "tooltip")				
                .style("opacity", 0);
    
    // Adds the svg canvas
    const svg = d3.select("a")
                  .append("svg")
                  .attr("width", w)
                  .attr("height", h);
    
    // Add the scatterplot
    svg.selectAll("circle")
       .data(data)
       .enter()
       .append("circle")
       .attr("cx", (d, i) => xScale(d[1]))
       .attr("cy", (d, i) => yScale(d[6]))
       .attr("r", 5)
       .attr("class", "dot")
       .style('fill', (d) => {
          return (d[5] ? "blue" : "orange")
       })
       //Tooltip appears on hover
       .on("mouseover", function(d) {		
           div.transition()		
               .duration(200)		
               .style("opacity", .9);		
           div .html(d[3] + ": " + d[4] + " <br/>Year: " + d[0] + " Time: " + d[2] + "<br/><br/>"  + d[5])	
               .style("left", (d3.event.pageX + 10) + "px")		
               .style("top", (d3.event.pageY - 28) + "px");
       })					
       .on("mouseout", function(d) {		
           div.transition()		
               .duration(500)		
               .style("opacity", 0);	
       });
    
    //Add and move the X-axis
    svg.append("g")
       .attr("transform", "translate(0, " + (h-padding) + ")")
       .call(xAxis)
       .append("text")
       .attr("class", "label")
       .attr("text-anchor", "end")
       .attr("x", w/2)
       .attr("y", padding-2)
       .text("Year of Race")
     
    //Add and move the Y-axis
    svg.append("g")
       .attr("transform", "translate(" + (padding + 10) + ", 0)")
       .call(yAxis)
       .append("text")
       .attr("class", "label")
       .attr("text-anchor", "end")
       .attr("x", -padding*2)
       .attr("y", -padding-10)
       .attr("dy", ".75em")
       .attr("transform", "rotate(-90)")
       .text("Time in Minutes")
    }
});
