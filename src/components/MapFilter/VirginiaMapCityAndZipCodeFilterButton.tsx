'use client';
import {VirginiaMapCityAndZipCodeFilter} from '@/components/MapFilter/VirginiaMapCityAndZipCodeFilter';
import {CityAndZip} from '@/utils/virginia';
import {useState} from 'react';
import {Button} from '@mui/joy';
import FilterAltIcon from '@mui/icons-material/FilterAlt';


interface VirginiaMapCityAndZipCodeFilterButtonProps {
  checkedItems: { [key: string]: boolean },
  onChange: (newItems: { [key: string]: boolean }) => void,
  virginiaCityAndZip: CityAndZip,
}

export const VirginiaMapCityAndZipCodeFilterButton = (props: VirginiaMapCityAndZipCodeFilterButtonProps) => {
  const {checkedItems, onChange, virginiaCityAndZip} = props;
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
            cityAndZipCheckItems={checkedItems}
            onCheckedItemsChange={onChange}
        />
      </>
  );
};
