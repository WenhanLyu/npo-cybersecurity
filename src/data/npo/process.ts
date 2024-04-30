import {useState, useEffect} from 'react';
import {parse} from 'csv-parse/sync';

export type NPOData = {
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
    assetCode: string;
    incomeCode: string;
};

const readAndProcessCSV = (fileContent: string): NPOData[] => {
    const records: any[] = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
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
        nteeCodeFull: record.NTEE_CD,
        assetCode: record.ASSET_CD,
        incomeCode: record.INCOME_CD,
    }));
};

export const useFetchNPOData = () => {
    const [data, setData] = useState<NPOData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        fetch('npodata_va.csv')
            .then((response) => response.text())
            .then((text) => {
                const processedData = readAndProcessCSV(text);
                setData(processedData);
                setLoading(false);
            })
            .catch((e) => {
                setError(e);
                setLoading(false);
            });
    }, []);

    return {data, loading, error};
};
