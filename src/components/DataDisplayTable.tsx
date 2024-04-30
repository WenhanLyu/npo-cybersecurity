import React from 'react';
import Table from '@mui/joy/Table';
import {NPOData} from '@/data/npo/process';

interface DataDisplayTableProps {
  combinedFilteredData: NPOData[];
  showZero: boolean;
}

const DataDisplayTable = ({combinedFilteredData, showZero}: DataDisplayTableProps) => {

  const codeLabels = [
    '0', '1 to 10k', '10k to 25k', '25k to 100k',
    '100k to 500k', '500k to 1M', '1M to 5M',
    '5M to 10M', '10M to 50M', '50M+'
  ];

  return (
      <div className={'overflow-auto max-w-[960px] max-h-[480px]'}>
        <div style={{overflowX: 'auto', overflowY: 'auto'}}>
          <Table sx={{
            width: 'auto',
            minWidth: '960px',
          }}>
            <thead>
            <tr>
              <th>EIN</th>
              <th>Name</th>
              <th>In Care Of Name</th>
              <th>Street</th>
              <th>City</th>
              <th>State</th>
              <th>Full ZIP</th>
              <th>NTEE Base</th>
              <th>NTEE Full</th>
              <th>Asset Size</th>
              {/* Renamed from Asset Code */}
              <th>Income Range</th>
              {/* Renamed from Income Code */}
            </tr>
            </thead>
            <tbody>
            {combinedFilteredData
                .filter((data) => showZero || (data.assetCode !== '0' && data.incomeCode !== '0'))
                .map((data) => (
                    <tr key={data.ein}>
                      <td>{data.ein.padStart(9, '0')}</td>
                      <td>{data.name}</td>
                      <td>{data.inCareOfName}</td>
                      <td>{data.street}</td>
                      <td>{data.city}</td>
                      <td>{data.state}</td>
                      <td>{data.zipFull}</td>
                      <td>{data.nteeCodeBase}</td>
                      <td>{data.nteeCodeFull}</td>
                      <td>{codeLabels[parseInt(data.assetCode)]}</td>
                      {/* Map assetCode to text label */}
                      <td>{codeLabels[parseInt(data.incomeCode)]}</td>
                      {/* Map incomeCode to text label */}
                    </tr>
                ))}
            </tbody>
          </Table>
        </div>
      </div>
  );
};

export default DataDisplayTable;
