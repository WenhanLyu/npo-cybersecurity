'use client';
import {NTEECodeData} from '@/data/npo/ntee';
import {useState} from 'react';
import {Button} from '@mui/joy';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import {HealthcareNteeFilter} from '@/components/MapFilter/HealthcareNteeFilter';

interface HealthcareNteeFilterButtonProps {
  checkedItems: { [key: string]: boolean },
  onChange: (newItems: { [key: string]: boolean }) => void,
  NTEECategories: NTEECodeData,
  NTEECode: NTEECodeData,
}

export const HealthcareNteeFilterButton = (props: HealthcareNteeFilterButtonProps) => {
  const {checkedItems, onChange, NTEECategories, NTEECode} = props;

  const [isOpen, setIsOpen] = useState(false);

  return (
      <>
        <Button
            onClick={() => setIsOpen(true)}
            variant={'solid'}
            color={'success'}
            size={'lg'}
        >
          <FilterAltIcon/> NTEE Filter
        </Button>

        <HealthcareNteeFilter
            NTEECategories={NTEECategories}
            NTEECode={NTEECode}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            nteeCheckedItems={checkedItems}
            onCheckedItemsChange={onChange}
        />
      </>
  );
};
