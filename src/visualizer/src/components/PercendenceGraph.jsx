import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import './GraphComponent.css';

function DirectedGraph({ groupID }) {
  const svgRef = useRef(null);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/data/${groupID}`);
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


    return () => {
      tooltip.remove();
    };
  }, [groupID]); 

  const renderGraph = (data) => {
    const { nodes, links } = data;
    const width = 2000;
    const height = 1000;
    const margin = 50;
    const maxX = width - margin;
    const maxY = height - margin;
    const minX = margin;
    const minY = margin;
    const tooltip = d3.select("#tooltip");

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');


    svg.append('defs').selectAll('marker')
      .data(['arrow']) 
      .enter().append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 13)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('class', 'arrowHead');


    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(d => d.Statistic[0] * 0.6))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2));


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
            `Mean: ${d.Statistic[0]}, Median: ${d.Statistic[1]}, 75th percentile: ${d.Statistic[2]}, 95th percentile: ${d.Statistic[3]}`
          )
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 25) + "px");
      })
      .on("mouseout", function () {
        tooltip.style("display", "none");
      });


    const node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .enter().append("g")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    node.append("rect")
      .attr("width", d => calculateTextWidth(d.id) + 11)
      .attr("height", 17)
      .attr("rx", 0)
      .attr("ry", 0)
      .attr("fill", "#69b3a2");

    node.append("text")
      .attr("x", d => calculateTextWidth(d.id) / 2 + 5.5)
      .attr("y", 16) 
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .style("font-size", "14px")
      .text(d => d.id);


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


    function calculateTextWidth(text) {
      const tempSvg = d3.select("body").append("svg")
        .attr("width", 0)
        .attr("height", 0)
        .style("visibility", "hidden");

      const tempText = tempSvg.append("text")
        .attr("font-size", "14px")
        .text(text);

      const textWidth = tempText.node().getComputedTextLength();
      tempSvg.remove(); 
      return textWidth;
    }
  };

  return (
    <div className="graph-container" style={{ width: '100%', height: '500px', overflow: 'hidden' }}>
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default DirectedGraph;