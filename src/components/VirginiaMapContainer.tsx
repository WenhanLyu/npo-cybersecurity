import React from 'react';
import {VirginiaMap} from '@/components/VirginiaMap';
import {NPOData} from '@/data/npo/process';

interface VirginiaMapContainerProps {
  data: { [key: string]: NPOData[] };
}

export const VirginiaMapContainer = (props: VirginiaMapContainerProps) => {
  const {data} = props;

  return (
      <div className={'border-2 border-black p-2 shadow-md bg-white'}>
        <VirginiaMap width={960} height={600} scale={6000} data={data}/>
      </div>
  );
};
