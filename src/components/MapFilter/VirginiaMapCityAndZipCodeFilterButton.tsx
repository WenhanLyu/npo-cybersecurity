'use client';
import {VirginiaMapCityAndZipCodeFilter} from '@/components/MapFilter/VirginiaMapCityAndZipCodeFilter';
import virginiaCityAndZip from '@/utils/virginia';
import {useState} from 'react';
import {Button} from '@mui/joy';
import FilterAltIcon from '@mui/icons-material/FilterAlt';


interface VirginiaMapCityAndZipCodeFilterButtonProps {

}

export const VirginiaMapCityAndZipCodeFilterButton = (props: VirginiaMapCityAndZipCodeFilterButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
      <>
        <Button
            onClick={() => setIsOpen(true)}
            variant={'solid'}
            color={'primary'}
            size={'lg'}
        >
          <FilterAltIcon/> City Filter
        </Button>

        <VirginiaMapCityAndZipCodeFilter
            selections={virginiaCityAndZip}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
        />
      </>
  );
};
