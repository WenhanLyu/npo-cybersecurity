import React, {useEffect, useState} from 'react';
import Table from '@mui/joy/Table';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import {NPOData} from '@/data/npo/process';

interface DataDisplayTableProps {
  combinedFilteredData: NPOData[];
  showZero: boolean;
}

const DataDisplayTable = ({combinedFilteredData, showZero}: DataDisplayTableProps) => {
  const [assetFilter, setAssetFilter] = useState<string>('');
  const [incomeFilter, setIncomeFilter] = useState<string>('');

  const codeLabels = [
    '0', '1 to 10k', '10k to 25k', '25k to 100k',
    '100k to 500k', '500k to 1M', '1M to 5M',
    '5M to 10M', '10M to 50M', '50M+'
  ];

  const handleAssetFilterChange = (event: React.SyntheticEvent | null,
                                   newValue: string | null,) => {
    setAssetFilter(newValue || '');
  };

  const handleIncomeFilterChange = (event: React.SyntheticEvent | null,
                                    newValue: string | null,) => {
    setIncomeFilter(newValue || '');
  };

  useEffect(() => {
    setAssetFilter('');
    setIncomeFilter('');
  }, [combinedFilteredData]);

  return (
      <div className={'flex flex-col overflow-auto max-w-[960px] max-h-[480px]'}>
        <div className={'flex justify-end space-x-4 p-4'}>
          <Select
              placeholder={'Filter by Asset Size'}
              value={assetFilter}
              onChange={handleAssetFilterChange}
              size={'sm'}
          >
            <Option value={''}>Filter by Asset Size</Option>
            {codeLabels.map((label, index) => (
                <Option key={index} value={label}>
                  {label}
                </Option>
            ))}
          </Select>
          <Select
              placeholder={'Filter by Income Range'}
              value={incomeFilter}
              onChange={handleIncomeFilterChange}
              size={'sm'}
          >
            <Option value={''}>Filter by Income Range</Option>
            {codeLabels.map((label, index) => (
                <Option key={index} value={label}>
                  {label}
                </Option>
            ))}
          </Select>
        </div>
        <div style={{overflowX: 'auto', overflowY: 'auto'}}>
          <Table sx={{width: 'auto', minWidth: '960px'}}>
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
              <th>Income Range</th>
            </tr>
            </thead>
            <tbody>
            {combinedFilteredData
                .filter(data => (showZero || (data.assetCode !== '0' && data.incomeCode !== '0')) &&
                    (!assetFilter || codeLabels[parseInt(data.assetCode)] === assetFilter) &&
                    (!incomeFilter || codeLabels[parseInt(data.incomeCode)] === incomeFilter))
                .map((data, index) => (
                    <tr key={`${data.ein.padStart(9, '0')}-${index}`}>
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
                      <td>{codeLabels[parseInt(data.incomeCode)]}</td>
                    </tr>
                ))}
            </tbody>
          </Table>
        </div>
      </div>
  );
};

export default DataDisplayTable;
