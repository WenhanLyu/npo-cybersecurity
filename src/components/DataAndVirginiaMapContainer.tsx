'use client';
import React, {useEffect, useState} from 'react';
import {HealthcareNteeFilterButton} from '@/components/MapFilter/HealthcareNteeFilterButton';
import {VirginiaMapCityAndZipCodeFilterButton} from '@/components/MapFilter/VirginiaMapCityAndZipCodeFilterButton';
import {VirginiaMapContainer} from '@/components/VirginiaMapContainer';
import virginiaCityAndZip from '@/utils/virginia';
import {NTEECategories, NTEECode} from '@/data/npo/ntee';
import {NPOData, useFetchNPOData} from '@/data/npo/process';
import {BarChart} from '@/components/BarChart';

interface DataAndVirginiaMapContainerProps {
}

export const DataAndVirginiaMapContainer = (props: DataAndVirginiaMapContainerProps) => {
    const [cityZipCheckItems, setCityZipCheckItems] = useState<{ [key: string]: boolean }>({});
    const [nteeCheckItems, setNteeCheckItems] = useState<{ [key: string]: boolean }>({});
    const {data, loading, error} = useFetchNPOData();
    const [cityZipFilteredData, setCityZipFilteredData] = useState<NPOData[]>([]);
    const [nteeCodeFilteredData, setNteeCodeFilteredData] = useState<NPOData[]>([]);
    const [combinedFilteredData, setCombinedFilteredData] = useState<NPOData[]>([]);
    const [combinedDataByZip, setCombinedDataByZip] = useState<{ [key: string]: NPOData[] }>({});

    const handleCityZipChange = (newItems: { [key: string]: boolean }) => {
        setCityZipCheckItems(newItems);
    };

    const handleNTEEChange = (newItems: { [key: string]: boolean }) => {
        setNteeCheckItems(newItems);
    };

    useEffect(() => {
        // Extract only zip codes from the keys where the corresponding value is true
        const zipFilteredKeys = Object.keys(cityZipCheckItems).filter(key => key.match(/\b\d{5}\b/) && cityZipCheckItems[key]).map(key => key.split('-')[1]);
        // Filter the data array based on the zip codes
        const filteredData = data.filter(item => zipFilteredKeys.includes(item.zip5));
        setCityZipFilteredData(filteredData);
    }, [cityZipCheckItems, data]);

    useEffect(() => {
        // Extract keys from nteeCheckItems that match criteria and consider only the last 3 characters (assuming format "E-E01")
        const nteeFilteredKeys = Object.keys(nteeCheckItems).filter(key => key.match(/^[A-Z]-[A-Z]\d{2}$/) && nteeCheckItems[key]).map(key => key.split('-')[1]);
        // Filter the data array based on the specific nteeCodeBase extracted from keys
        const filteredData = data.filter(item => nteeFilteredKeys.includes(item.nteeCodeBase));
        setNteeCodeFilteredData(filteredData);
    }, [nteeCheckItems, data]);

    useEffect(() => {
        // Perform a combination of the two filtered arrays
        const combinedData = cityZipFilteredData.filter(zipItem =>
            nteeCodeFilteredData.some(nteeItem => nteeItem.ein === zipItem.ein)
        );

        setCombinedFilteredData(combinedData);
    }, [cityZipFilteredData, nteeCodeFilteredData]);

    useEffect(() => {
        const zipMap: { [key: string]: NPOData[] } = {};

        combinedFilteredData.forEach(npoData => {
            if (!zipMap[npoData.zip5]) {
                zipMap[npoData.zip5] = [];
            }
            zipMap[npoData.zip5].push(npoData);
        });

        setCombinedDataByZip(zipMap);
    }, [combinedFilteredData]);

    return (
        <div className={'w-1280px m-auto'}>
            <div className={'w-full flex justify-end pb-2'}>
                <HealthcareNteeFilterButton
                    checkedItems={nteeCheckItems}
                    onChange={handleNTEEChange}
                    NTEECategories={NTEECategories}
                    NTEECode={NTEECode}
                />
                <VirginiaMapCityAndZipCodeFilterButton
                    checkedItems={cityZipCheckItems}
                    onChange={handleCityZipChange}
                    virginiaCityAndZip={virginiaCityAndZip}
                />
            </div>
            <div className={'flex justify-center'}>
                <VirginiaMapContainer
                    data={combinedDataByZip}
                />
            </div>

            <div className={'w-full flex flex-col items-center mt-4'}>
                <BarChart data={combinedDataByZip} codeType={'assetCode'} title={'Asset Code Distribution'}/>
                <BarChart data={combinedDataByZip} codeType={'incomeCode'} title={'Income Code Distribution'}/>
            </div>
        </div>
    );
};
