'use client';
import React, {useEffect, useState} from 'react';
import {HealthcareNteeFilterButton} from '@/components/MapFilter/HealthcareNteeFilterButton';
import {VirginiaMapCityAndZipCodeFilterButton} from '@/components/MapFilter/VirginiaMapCityAndZipCodeFilterButton';
import {VirginiaMapContainer} from '@/components/VirginiaMapContainer';
import virginiaCityAndZip from '@/utils/virginia';
import {NTEECategories, NTEECode} from '@/data/npo/ntee';

interface DataAndVirginiaMapContainerProps {
}

export const DataAndVirginiaMapContainer = (props: DataAndVirginiaMapContainerProps) => {
  const [cityZipCheckItems, setCityZipCheckItems] = useState<{ [key: string]: boolean }>({});
  const [nteeCheckItems, setNteeCheckItems] = useState<{ [key: string]: boolean }>({});

  const handleCityZipChange = (newItems: { [key: string]: boolean }) => {
    setCityZipCheckItems(newItems);
  };

  const handleNTEEChange = (newItems: { [key: string]: boolean }) => {
    setNteeCheckItems(newItems);
  };

  // useEffect for cityZipCheckItems
  useEffect(() => {
    console.log('City and ZIP Check Items have changed:', cityZipCheckItems);
  }, [cityZipCheckItems]);

  // useEffect for nteeCheckItems
  useEffect(() => {
    console.log('NTEE Check Items have changed:', nteeCheckItems);
  }, [nteeCheckItems]);

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
              data={[1, 2, 3]}
          />
        </div>
      </div>
  );
};
