import React, {useEffect, useRef} from 'react';
import * as d3 from 'd3';
import {NPOData} from '@/data/npo/process';

interface BarChartProps {
  data: { [key: string]: NPOData[] };
  codeType: 'assetCode' | 'incomeCode';
  title: string;
  showZeroColumn: boolean;
}

export const BarChart = ({data, codeType, title, showZeroColumn}: BarChartProps) => {
  const ref = useRef<SVGSVGElement>(null);

  const codeLabels = [
    '0', '1 to 10k', '10k to 25k', '25k to 100k',
    '100k to 500k', '500k to 1M', '1M to 5M',
    '5M to 10M', '10M to 50M', '50M+'
  ];

  useEffect(() => {
    const mappedData = Object.values(data).flat();
    const countByCode = Array(10).fill(0);

    mappedData.forEach(item => {
      const code = parseInt(item[codeType], 10);
      if (!isNaN(code)) {
        countByCode[code]++;
      }
    });

    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();  // Clear svg for redraw

    // Increase margin.top to add more space between the title and data area
    const margin = {top: 40, right: 40, bottom: 35, left: 40};
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const filteredLabels = showZeroColumn ? codeLabels : codeLabels.slice(1);
    const filteredCounts = showZeroColumn ? countByCode : countByCode.slice(1);

    const x = d3.scaleBand()
        .domain(filteredLabels)
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, Math.max(...filteredCounts)])
        .range([height, 0]);

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    g.append('text')
        .attr('x', width / 2)
        .attr('y', -20) // Adjust Y position of title relative to added margin
        .attr('text-anchor', 'middle')
        .text(title)
        .style('font-size', '16px')
        .style('font-weight', 'bold');

    const xAxis = d3.axisBottom(x);
    g.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis);

    g.append('g')
        .call(d3.axisLeft(y));

    g.selectAll('.bar')
        .data(filteredCounts)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', (d, i) => x(filteredLabels[i])!)
        .attr('y', d => y(d))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d))
        .attr('fill', 'steelblue');
    
    g.selectAll('.bar')
        .append('title')
        .text((d: any) => d.toString());

    g.selectAll('.bar-label')
        .data(filteredCounts)
        .enter().append('text')
        .attr('x', (d, i) => x(filteredLabels[i])! + x.bandwidth() / 2)
        .attr('y', d => y(d) - 5)
        .attr('text-anchor', 'middle')
        .text(d => d);
  }, [data, codeType, title, showZeroColumn]);

  return <svg ref={ref} width={960} height={500}></svg>;
};
