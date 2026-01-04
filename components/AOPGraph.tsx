import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { AOPData, AOPNodeType } from '../types';

interface AOPGraphProps {
  data: AOPData;
}

export const AOPGraph: React.FC<AOPGraphProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const width = 800;
    const height = 400;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous

    // Simple manual layout logic for MIE -> KE -> AO flow (Left to Right)
    // Map nodes to layers based on type or simple index for now since we know the flow
    const nodes = data.nodes.map(n => ({ ...n }));
    const links = data.edges.map(e => ({ source: e.source, target: e.target }));

    // Define color scale
    const colorMap: Record<string, string> = {
      [AOPNodeType.MIE]: '#3b82f6', // blue-500
      [AOPNodeType.KE]: '#f59e0b',  // amber-500
      [AOPNodeType.AO]: '#ef4444',  // red-500
    };

    // Simulation
    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide(50));
      
      // Fix MIE to left and AO to right approximately
      nodes.forEach((n: any) => {
         if (n.type === AOPNodeType.MIE) {
             n.fx = 100;
         } else if (n.type === AOPNodeType.AO) {
             n.fx = width - 100;
         }
      });

    // Arrow marker
    svg.append("defs").selectAll("marker")
      .data(["end"])
      .enter().append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25) 
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#94a3b8");

    const link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .enter().append("line")
      .attr("stroke", "#94a3b8")
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrow)");

    const node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .enter().append("g")
      .call(d3.drag<any, any>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          if (d.type !== AOPNodeType.MIE && d.type !== AOPNodeType.AO) {
              d.fx = null;
              d.fy = null;
          }
        })
      );

    node.append("circle")
      .attr("r", 20)
      .attr("fill", (d: any) => colorMap[d.type] || '#ccc')
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .attr("class", "shadow-md");

    node.append("text")
      .text((d: any) => d.label)
      .attr("x", 0)
      .attr("y", 35)
      .attr("text-anchor", "middle")
      .attr("class", "text-xs fill-slate-700 font-semibold")
      .style("pointer-events", "none");

    node.append("text")
      .text((d: any) => d.type)
      .attr("x", 0)
      .attr("y", 4)
      .attr("text-anchor", "middle")
      .attr("class", "text-[10px] fill-white font-bold pointer-events-none");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
        simulation.stop();
    };
  }, [data]);

  return (
    <div className="bg-white rounded-lg shadow border border-slate-200 p-4">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Adverse Outcome Pathway (AOP) Visualization</h3>
      <div className="flex justify-center items-center gap-4 mb-2 text-sm">
        <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-blue-500 mr-1"></span> MIE (Initiating)</div>
        <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-amber-500 mr-1"></span> KE (Key Event)</div>
        <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-red-500 mr-1"></span> AO (Adverse Outcome)</div>
      </div>
      <svg ref={svgRef} width="800" height="400" className="w-full bg-slate-50 rounded" />
    </div>
  );
};
