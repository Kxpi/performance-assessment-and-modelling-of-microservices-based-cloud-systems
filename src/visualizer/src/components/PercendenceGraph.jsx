import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import './GraphComponent.css'; 

const DirectedGraph = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    // Fetch data from the /data endpoint
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/data');
        const data = await response.json();
        renderGraph(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    const tooltip = d3.select("body").append("div")
    .attr("id", "tooltip")
    .style("display", "none")
    .style("position", "absolute")
    .style("background", "rgba(0, 0, 0, 0.7)")
    .style("color", "#fff")
    .style("padding", "5px 10px")
    .style("border-radius", "5px")
    .style("pointer-events", "none");
        
  }, []);

  const renderGraph = (data) => {
    const { nodes, links } = data;

    const width = 2000;
    const height = 1000;
    const margin = 50; // Adjust this margin as needed
    const maxX = width - margin;
    const maxY = height - margin;
    const minX = margin;
    const minY = margin;
    var tooltip = d3.select("#tooltip");
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(function(d) { return d.id; }).distance(function(d) { return d.Statistic[0]*0.5; }))
      .force('center', d3.forceCenter(width / 2, height / 2));

    var tempSvg = d3.select("body").append("svg")
      .attr("width", 0)
      .attr("height", 0)
      .style("visibility", "hidden");

      const link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .enter().append("line")
      .attr("marker-end", "url(#arrow)")
      .style("stroke-width", 4)
      .on("mouseover", function (event, d) {
        tooltip.style("display", "block")
          .html(
            "Mean: " + d.Statistic[0] +
            ", Median: " + d.Statistic[1] +
            ", 75th percentile: " + d.Statistic[2] +
            ", 95th percentile: " + d.Statistic[3]
          )
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 25) + "px");
       })
       .on("mouseout", function () {
        tooltip.style("display", "none");
       });

    var node = svg.append("g")
       .attr("class", "nodes")
       .selectAll("g")
       .data(nodes)
       .enter().append("g")
       .attr("transform", d => `translate(${d.x},${d.y})`)
       .call(d3.drag()
           .on("start", dragstarted)
           .on("drag", dragged)
           .on("end", dragended));

    node.each(function(d) {
            var text = tempSvg.append("text")
                .attr("font-size", "11px")
                .text(d.id);

            var textWidth = text.node().getComputedTextLength();
            text.remove();

            var rect = d3.select(this)
                .append("rect")
                .attr("width", textWidth + 11) // Add padding
                .attr("height", 17)
                .attr("rx", 0)
                .attr("ry", 0)
                .attr("fill", "#69b3a2");

            d3.select(this)
                .append("text")
                .attr("x", function() {
                    return (textWidth + 11) / 2; // Set text position to center
                })
                .attr("y", 9)
                .attr("text-anchor", "middle")
                .attr("fill", "black")
                .style("font-size", "11px")
                .text(d.id);
        });

        simulation.on('tick', () => {
            link
              .attr('x1', d => d.source.x)
              .attr('y1', d => d.source.y)
              .attr('x2', d => d.target.x)
              .attr('y2', d => d.target.y);
        
            node.attr('transform', d => `translate(${d.x},${d.y})`);
          });

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {

      d.fx = Math.max(minX, Math.min(maxX, event.x));
      d.fy = Math.max(minY, Math.min(maxY, event.y));
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  };

  return <svg ref={svgRef}></svg>;
};

export default DirectedGraph;