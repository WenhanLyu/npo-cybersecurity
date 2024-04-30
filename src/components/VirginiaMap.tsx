'use client';

import React, {useEffect, useRef} from 'react';
import * as d3 from 'd3';
import {Feature, Geometry} from 'geojson';
import {NPOData} from '@/data/npo/process';

const turf = require('@turf/turf');

export interface VirginiaMapProps {
  height: number;
  width: number;
  scale: number;
  data: { [key: string]: NPOData[] };
}

export const VirginiaMap = (props: VirginiaMapProps) => {
  const {height, width, scale, data} = props;
  const virginiaMapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!virginiaMapContainer.current) return;

    const projection = d3.geoMercator()
        .scale(scale)
        .translate([width * (scale / width + 2.9), height * (scale / height - 2.4)]);
    const pathGenerator = d3.geoPath().projection(projection);

    const vaMapData = require('@/data/maps/VA_Zip_Codes.json');
    vaMapData.features.forEach((feature: Feature) => {
      if (feature.geometry)
        feature.geometry = turf.rewind(feature.geometry, {reverse: true}) as Geometry;
    });

    // Main SVG
    const svg = d3.select(virginiaMapContainer.current)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    const g = svg.append('g');

    const zoom = d3.zoom().on('zoom', (event: any) => {
      const {transform} = event;
      g.attr('transform', transform);
    });
    // @ts-ignore
    g.call(zoom);

    // @ts-ignore
    svg.call(zoom);

    const maxEntries = d3.max(Object.values(data), arr => arr.length) || 0;
    const colorScale = d3.scaleSequential(d3.interpolateViridis).domain([0, maxEntries]);

    g.selectAll('path')
        .data(vaMapData.features)
        .enter().append('path')
        // @ts-ignore
        .attr('d', pathGenerator)
        .attr('stroke', '#000')
        .attr('stroke-width', 0.5)
        .attr('fill', (d: any) => {
          const zipData = data[d.properties.ZIP_CODE];
          return zipData ? colorScale(zipData.length) : '#ccc';
        })
        .on('click', (event, d: any) => {

          // Remove any existing tooltips before creating a new one
          d3.selectAll('.tooltip').remove();

          const tooltipDiv = d3.select('body').append('div')
              .attr('class', 'tooltip')
              .style('position', 'absolute')
              .style('z-index', '1000') // High z-index to bring to front
              .style('opacity', 0)
              .style('background', '#f5f5f5')  // MUI-like background
              .style('padding', '10px')  // MUI-like padding
              .style('border', '1px solid #ddd')  // MUI-like border
              .style('border-radius', '4px')  // MUI-like border-radius
              .style('font-family', '"Roboto", "Helvetica", "Arial", sans-serif')  // MUI-like font
              .style('max-width', '300px')  // Increased max-width for wider text
              .style('white-space', 'nowrap')  // Prevents text from wrapping
              .style('overflow', 'hidden')  // Ensures overflow is hidden
              .style('text-overflow', 'ellipsis');  // Adds ellipsis if text is too long

          tooltipDiv.transition()
              .duration(500)
              .style('opacity', 1);
          tooltipDiv.html(`City: ${d.properties.PO_NAME}<br/>ZIP Code: ${d.properties.ZIP_CODE}`)
              .style('left', `${event.pageX + 20}px`)
              .style('top', `${event.pageY - 28}px`);
        })
        .on('mouseout', () => {
          d3.select('.tooltip').remove();
        });

    // Legend SVG - this one is separate and not within the zoomable 'g' element
    const legendSvg = d3.select(virginiaMapContainer.current)
        .append('svg')
        .attr('width', width)
        .attr('height', 50)
        .style('position', 'absolute')
        .style('bottom', '20px')
        .style('left', '0px');

    const legendWidth = 300;
    const legendHeight = 20;
    const legendNumSteps = 10;
    const xScale = d3.scaleLinear()
        .domain([0, maxEntries])
        .range([0, legendWidth]);

    const legendData = Array.from({length: legendNumSteps}, (_, i) => maxEntries / legendNumSteps * (i + 1));

    const legend = legendSvg.append('g')
        .attr('transform', `translate(${(width - legendWidth) / 2}, 5)`);

    legend.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', legendWidth)
        .attr('height', legendHeight)
        .style('fill', 'url(#gradient)');

    const defs = legendSvg.append('defs');
    const linearGradient = defs.append('linearGradient')
        .attr('id', 'gradient');

    linearGradient.selectAll('stop')
        .data(legendData.map((d, i) => ({offset: (i / legendNumSteps) * 100, color: colorScale(d)})))
        .enter().append('stop')
        .attr('offset', d => `${d.offset}%`)
        .attr('style', d => `stop-color:${d.color}`);

    legend.selectAll('text')
        .data(legendData)
        .enter().append('text')
        .attr('x', (d, i) => xScale(legendData[i] - (maxEntries / legendNumSteps / 2)))
        .attr('y', legendHeight + 15)
        .style('font-size', '12px')
        .attr('text-anchor', 'middle')
        .text(d => Math.round(d));

    return () => {
      if (virginiaMapContainer.current) {
        virginiaMapContainer.current.innerHTML = '';
      }
    };

  }, [data, height, scale, width]);

  return (
      <>
        <div ref={virginiaMapContainer} className={'overflow-hidden relative'} style={{height: height + 'px'}}/>
      </>
  );
};
