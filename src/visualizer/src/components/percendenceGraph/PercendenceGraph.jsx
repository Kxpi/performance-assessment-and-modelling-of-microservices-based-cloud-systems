import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import './GraphComponent.css';
import ReactFlow, {
  Controls,
} from 'reactflow';


function DirectedGraph({ data, selectedGroup, setSelectedOperation, serviceColors, lastSelected }) {
  const svgRef = useRef(null);
  let svg;
  let zoom;

  useEffect(() => {

    const tooltip = d3.select("body").append("div")
    .attr("id", "tooltip")
    .style("display", "none")
    .style("position", "absolute")
    .style("background", "rgba(0, 0, 0, 0.7)")
    .style("color", "#fff")
    .style("padding", "5px 10px")
    .style("border-radius", "5px")
    .style("pointer-events", "none")
    .style("z-index", "10"); 

    if (data && Object.keys(data).length !== 0) {
      renderGraph(data, selectedGroup, setSelectedOperation, serviceColors);
    };

    if (svgRef.current) {
      svg = d3.select(svgRef.current);


      zoom = d3.zoom()
        .scaleExtent([0.1, 10]) 
        .on('zoom', (event) => {
          svg.selectAll('.nodes, .links').attr('transform', event.transform);
        });

      svg.call(zoom);
    }

    return () => {
      if (svg) {
        svg.on('.zoom', null); 
      }
      tooltip.remove();
    };
  }, [data]); 

  const renderGraph = (data, selectedGroup, setSelectedOperation, serviceColors) => {
    const { nodes, links } = data;
    const width = 2500;
    const height = 1500;
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
      .attr('class', 'arrowHead')



    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(d => d.Statistic[0]+50))
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
        .on("end", dragended))
        .on("click", (event, d) => {
          setSelectedOperation(d.id); 
        });

    node.append("rect")
      .attr("width", d => calculateTextWidth(d.id) + 20)
      .attr("height", 40)
      .attr("rx", 0)
      .attr("ry", 0)
      .attr("fill", d => set_color(d));

    node.append("text")
      .attr("x", d => calculateTextWidth(d.id) / 2 + 5.5)
      .attr("y", 30) 
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .style("font-size", "20px")
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
        .attr("font-size", "20px")
        .text(text);

      const textWidth = tempText.node().getComputedTextLength();
      tempSvg.remove(); 
      return textWidth;
    }
    function set_color(d){
        return(serviceColors[selectedGroup["operation_stats"][d.id]["service_name"]])
    }
  };

  const handleZoomIn = () => {
    if (svg) {
      svg.transition().call(zoom.scaleBy, 1.2); 
    }
  };

  const handleZoomOut = () => {
    if (svg) {
      svg.transition().call(zoom.scaleBy, 0.8); 
    }
  };

  const handleCenterGraph = () => {
    if (svg) {
      const svgWidth = svg.node().getBoundingClientRect().width;
      const svgHeight = svg.node().getBoundingClientRect().height;
      const containerWidth = svg.node().parentElement.clientWidth;
      const containerHeight = svg.node().parentElement.clientHeight;
      const offsetX = (containerWidth - svgWidth) / 2;
      const offsetY = (containerHeight - svgHeight) / 2;
      
      svg.transition().call(zoom.transform, d3.zoomIdentity.translate(offsetX, offsetY)); // Center the graph
    }
  };

  const isServicedifferent = () => {
    if (data && data.nodes && selectedGroup && selectedGroup["operation_stats"]) {
      return data.nodes.some(node => {
        const operationStat = selectedGroup["operation_stats"][node.id];
        if (operationStat) {
          const serviceColor = serviceColors[operationStat["service_name"]];
          return serviceColor === null;
        }
        return false;
      });
    }
    return false;
  };

  const add_distance = (d) => {
    if (d.Statistic[0] < 100){
      return (d.Statistic[0]+25)*0.8;
    }
    else{
      return d.Statistic[0]*0.8;
    }
  }

  return (
    <div className="graph-container" style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      {!selectedGroup ? (
        // If no group is selected, display "No Group Selected"
        <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', flexDirection: 'column' }}>
          No Group Selected
        </div>
      ) : data === null ? (
        <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', flexDirection: 'column' }}>
          Wait until receive data
        </div>
      ) : data.nodes.length === 0  ? (
        <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', flexDirection: 'column' }}>
          Impossible to get transfer time
        </div>
      ) : ! isServicedifferent() ?(
        <div>
          <div className="react-flow__panel_top_left">
            <button className="react-flow__controls-button" onClick={handleZoomIn}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M32 18.133H18.133V32h-4.266V18.133H0v-4.266h13.867V0h4.266v13.867H32z"></path></svg>
            </button>
            <button className="react-flow__controls-button" onClick={handleZoomOut}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 5"><path d="M0 0h32v4.2H0z"></path></svg>
            </button>
            <button className="react-flow__controls-button" onClick={handleCenterGraph}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 30"><path d="M3.692 4.63c0-.53.4-.938.939-.938h5.215V0H4.708C2.13 0 0 2.054 0 4.63v5.216h3.692V4.631zM27.354 0h-5.2v3.692h5.17c.53 0 .984.4.984.939v5.215H32V4.631A4.624 4.624 0 0027.354 0zm.954 24.83c0 .532-.4.94-.939.94h-5.215v3.768h5.215c2.577 0 4.631-2.13 4.631-4.707v-5.139h-3.692v5.139zm-23.677.94c-.531 0-.939-.4-.939-.94v-5.138H0v5.139c0 2.577 2.13 4.707 4.708 4.707h5.138V25.77H4.631z"></path></svg>
            </button>
          </div>
          <svg ref={svgRef}></svg>
        </div>
      ) : (
        <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', flexDirection: 'column' }}>
          Wait until receive data
        </div>
      )}
    </div>
  );
}

export default DirectedGraph;

