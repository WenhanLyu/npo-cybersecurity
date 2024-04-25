'use client'

import React, {useEffect, useRef} from 'react'
import * as d3 from 'd3'
import {FeatureCollection, Feature, Geometry, GeoJSON} from 'geojson';

const turf = require('@turf/turf');

export interface VirginiaMapProps {
  height: number,
  width: number,
  scale: number,
  data: any
}

export const VirginiaMap = (props: VirginiaMapProps) => {
  // const colors = require('../utils/colors')
  const {height, width, scale, data} = props
  const virginiaMapContainer = useRef<HTMLDivElement>(null)

  const zoomed = (event: any) => {
    const {transform} = event
    d3.select(virginiaMapContainer.current).select('svg').attr('transform', transform)
  }

  useEffect(() => {
    if (!virginiaMapContainer.current) return;

    const projection = d3.geoMercator()
        .scale(scale)
        .translate([width * (scale / width + 2.9), height * (scale / height - 2.4)]);
    const pathGenerator = d3.geoPath().projection(projection);

    const vaMapData = require('@/data/maps/VA_Zip_Codes.json')
    vaMapData.features.forEach((feature: GeoJSON.Feature) => {
      if (feature.geometry !== null && feature.geometry !== undefined)
        feature.geometry = turf.rewind(feature.geometry, {reverse: true}) as Geometry;
    })
    // const padding = 10
    // const projection = d3.geoMercator().fitSize([width, height], vaMapData)

    const path = d3.geoPath().projection(projection);

    const svg = d3.select(virginiaMapContainer.current).append('svg')
        .attr('width', width)
        .attr('height', height)

    const zoom = d3.zoom().on('zoom', zoomed)
    // @ts-ignore
    svg.call(zoom)

    const colors = ["#E57373", "#81D4FA"];

    svg.append("g")
        .selectAll("path")
        .data(vaMapData.features)
        .enter().append("path")
        // .attr("class", "county")
        .attr("d", (d) => pathGenerator(d as d3.GeoPermissibleObjects))
        .attr("stroke", "#000")
        .attr("stroke-width", 0.5)
        .attr("fill", (d, i) => colors[i % 2])
        .on('click', function (event, d: any) {
          console.log(d.properties.ZIP_CODE);
        });

    return () => {
      if (virginiaMapContainer.current) {
        virginiaMapContainer.current.innerHTML = '';
      }
    };

  }, []);


  return (
      <>
        <div ref={virginiaMapContainer}/>
      </>
  )
}
