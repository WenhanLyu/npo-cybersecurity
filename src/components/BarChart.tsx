import React, {useEffect, useRef} from 'react';
import * as d3 from 'd3';
import {NPOData} from '@/data/npo/process';

interface BarChartProps {
    data: { [key: string]: NPOData[] };
    codeType: 'assetCode' | 'incomeCode';
    title: string;
}

export const BarChart = ({data, codeType, title}: BarChartProps) => {
    const ref = useRef(null);

    const codeLabels = [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
    ];

    const legendDescriptions = [
        '0', '1 to 9,999', '10,000 to 24,999', '25,000 to 99,999',
        '100,000 to 499,999', '500,000 to 999,999', '1,000,000 to 4,999,999',
        '5,000,000 to 9,999,999', '10,000,000 to 49,999,999', '50,000,000 and greater'
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

        const margin = {top: 20, right: 160, bottom: 35, left: 40};
        const width = 960 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        const x = d3.scaleBand()
            .domain(codeLabels)
            .range([0, width])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, Math.max(...countByCode)])
            .range([height, 0]);

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        g.append('text')
            .attr('x', width / 2)
            .attr('y', -10)
            .attr('text-anchor', 'middle')
            .text(title)
            .style('font-size', '16px')
            .style('font-weight', 'bold');

        g.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x));

        g.append('g')
            .call(d3.axisLeft(y));

        const bar = g.selectAll('.bar')
            .data(countByCode)
            .enter().append('rect')
            .attr('class', 'bar')
            .attr('x', (d, i) => x(codeLabels[i])!)
            .attr('y', d => y(d))
            .attr('width', x.bandwidth())
            .attr('height', d => height - y(d))
            .attr('fill', 'steelblue');

        bar.append('title')
            .text(d => d.toString());

        g.selectAll('.text')
            .data(countByCode)
            .enter().append('text')
            .attr('x', (d, i) => x(codeLabels[i])! + x.bandwidth() / 2)
            .attr('y', d => y(d) - 5)
            .attr('text-anchor', 'middle')
            .text(d => d);

        svg.append('g')
            .attr('transform', `translate(${width + margin.left + 40}, ${margin.top})`)
            .selectAll('text')
            .data(legendDescriptions)
            .enter().append('text')
            .attr('y', (d, i) => i * 20)
            .text((d, i) => `${i}: ${d}`)
            .style('font-size', '12px');

    }, [data, codeType, title]);

    return (
        <svg ref={ref} width={1160} height={500}></svg>
    );
};