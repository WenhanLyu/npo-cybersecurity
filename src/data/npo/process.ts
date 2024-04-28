import {promises as fs} from 'fs';
import {parse} from 'csv-parse/sync';

type NPOData = {
  ein: string;
  name: string;
  inCareOfName: string;
  street: string;
  city: string;
  state: string;
  zip5: string;
  zipFull: string;
  nteeCodeBase: string;
  nteeCodeFull: string;
};

async function readAndProcessCSV(filePath: string): Promise<NPOData[]> {
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const records: any[] = parse(fileContent, {
    columns: true,
    skip_empty_lines: true
  });

  return records.map((record) => ({
    ein: record.EIN,
    name: record.NAME,
    inCareOfName: record.ICO.startsWith('% ') ? record.ICO.slice(2) : record.ICO,
    street: record.STREET,
    city: record.CITY,
    state: record.STATE,
    zip5: record.ZIP.split('-')[0],
    zipFull: record.ZIP,
    nteeCodeBase: record.NTEE_CD.substring(0, 3),
    nteeCodeFull: record.NTEE_CD
  }));
}

const filePath = 'npodata_va.csv';

// Define a constant which is a promise of the processed data
const processedDataPromise: Promise<NPOData[]> = readAndProcessCSV(filePath);

processedDataPromise.then((data) => {
  console.log('CSV data has been processed if you need to check on its completion here.');
  // Further actions can be performed here with the 'data'
}).catch((error) => {
  console.error('Error in processed data promise:', error);
});

export const processedNPOData = processedDataPromise;
