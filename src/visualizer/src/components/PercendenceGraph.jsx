import React, { useEffect, useRef,useState } from 'react';
import * as d3 from 'd3';

const PercendenceGraph = () => {
  const svgRef = useRef(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const svg = d3.select(svgRef.current);

    const width = 8000;
    const height = 4000;

    const simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(function(d) { return d.Statistic[0] * 2; }))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));

    const tooltip = d3.select("#tooltip");

    var tempSvg = d3.select("body").append("svg")
    .attr("width", 0)
    .attr("height", 0)
    .style("visibility", "hidden");

    // Fetch data
    fetch('http://127.0.0.1:5000/data')
      .then(response => response.json())
      .then(data => {
                // Randomly assign initial positions to nodes
                data.nodes.forEach(function(d) {
                    d.x = Math.random() * width;
                    d.y = Math.random() * height;
                });

                var link = svg.append("g")
                    .attr("class", "links")
                    .selectAll("line")
                    .data(data.links)
                    .enter().append("line")
                    .attr("marker-end", "url(#arrow)")
                    .style("stroke-width", 4)
                    .on("mouseover", function(event, d) {
                        tooltip.style("display", "block")
                            .html("Mean: " + d.Statistic[0] + ", Median: " + d.Statistic[1] + ",\n 75 percentile: " + d.Statistic[2] + ",\n 95 percentile: " + d.Statistic[3])
                            .style("left", (event.pageX + 10) + "px")
                            .style("top", (event.pageY - 25) + "px");
                    })
                    .on("drag", function(event, d) {
                        d.fx = event.x;
                        d.fy = event.y;
                    })

                var node = svg.append("g")
                    .attr("class", "nodes")
                    .selectAll("g")
                    .data(data.nodes)
                    .enter().append("g")
                    .attr("transform", d => `translate(${d.x},${d.y})`)
                    .call(d3.drag()
                        .on("start", dragStarted)
                        .on("drag", dragged)
                        .on("end", dragEnded));

                node.each(function(d) {
                    var text = tempSvg.append("text")
                        .attr("font-size", "25px")
                        .text(d.id);

                    var textWidth = text.node().getBBox().width;
                    text.remove();

                    var rect = d3.select(this)
                        .append("rect")
                        .attr("width", textWidth + 40) // Add padding
                        .attr("height", 40)
                        .attr("rx", 0)
                        .attr("ry", 0)
                        .attr("fill", "#69b3a2");

                    d3.select(this)
                        .append("text")
                        .attr("x", function() {
                            return (textWidth + 40) / 2; // Set text position to center
                        })
                        .attr("y", 20)
                        .attr("text-anchor", "middle")
                        .attr("fill", "black")
                        .style("font-size", "25px")
                        .text(d.id);
                });

                simulation
                    .nodes(data.nodes)
                    .on("tick", ticked);

                simulation.force("link")
                    .links(data.links);

                svg.append("defs").append("marker")
                    .attr("id", "arrow")
                    .attr("viewBox", "-0 -5 10 10")
                    .attr("refX", 25)
                    .attr("refY", 0)
                    .attr("orient", "auto")
                    .attr("markerWidth", 6)
                    .attr("markerHeight", 6)
                    .attr("xoverflow", "visible")
                    .append("svg:path")
                    .attr("d", "M 0,-5 L 10 ,0 L 0,5")
                    .attr("fill", "#999")
                    .style("stroke","none");

                function ticked() {
                    node.attr("transform", d => `translate(${d.x},${d.y})`);

                    link.attr("x1", function(d) { return d.source.x + 25; })
                        .attr("y1", function(d) { return d.source.y + 10; })
                        .attr("x2", function(d) { return d.target.x + 25; })
                        .attr("y2", function(d) { return d.target.y + 10; });
                }

                function dragStarted(event, d) {
                    if (!event.active) simulation.alphaTarget(0.3).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                }
                
                function dragged(event, d) {
                    d.fx = event.x;
                    d.fy = event.y;
                }
                
                function dragEnded(event, d) {
                    if (!event.active) simulation.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                }
      })
      .catch(error => console.error('Error:', error));
      setLoading(false);
  }, []); // Empty dependency array to run the effect only once
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <div className="tooltip" id="tooltip"></div>
      <svg ref={svgRef} width={8000} height={4000}></svg>
    </div>
  );
};

export default PercendenceGraph;