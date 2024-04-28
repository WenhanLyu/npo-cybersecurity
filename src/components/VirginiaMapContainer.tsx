import React from 'react';
import {VirginiaMap} from '@/components/VirginiaMap';

interface VirginiaMapContainerProps {
  data: number[]; // Assuming data is just an array of numbers for simplification
}

export const VirginiaMapContainer = (props: VirginiaMapContainerProps) => {
  const {data} = props;

  return (
      <div className={'border-2 border-gray-300 p-2'}>
        <VirginiaMap width={960} height={600} scale={6000} data={data}/>
      </div>
  );
};
