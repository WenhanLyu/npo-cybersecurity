'use client'
import {useEffect, useState} from "react";
import {Checkbox, Modal, Sheet, Typography} from '@mui/joy';

type CityAndZip = {
  [key: string]: string[]
}

interface ModalCheckboxFilterProps {
  selections: CityAndZip,
  isOpen: boolean,
  onClose: () => void,
}

export const ModalCheckboxFilter = (props: ModalCheckboxFilterProps) => {
  const {selections, isOpen, onClose} = props;
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const initialCheckedItems: { [key: string]: boolean } = {};
    Object.entries(selections).forEach(([city, zips]) => {
      initialCheckedItems[city] = true;  // Mark city as checked
      zips.forEach(zip => {
        initialCheckedItems[`${city}-${zip}`] = true;  // Mark each zip as checked
      });
    });
    setCheckedItems(initialCheckedItems);
  }, [selections]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, checked} = event.target;
    setCheckedItems(prev => ({...prev, [name]: checked}));

    // Automatically check/uncheck children
    if (selections[name]) {
      selections[name].forEach(zip => {
        setCheckedItems(prev => ({...prev, [`${name}-${zip}`]: checked}));
      });
    } else {
      const [city,] = name.split('-');
      const areAllSame = selections[city].every(zip => checkedItems[`${city}-${zip}`] === checked);
      if (!areAllSame) {
        setCheckedItems(prev => ({...prev, [city]: false}));
      } else {
        setCheckedItems(prev => ({...prev, [city]: true}));
      }
    }
  }

  return (
      <Modal open={isOpen} onClose={onClose}>
        <Sheet variant="outlined" sx={{width: 400, p: 2, maxHeight: '90vh', overflowY: 'auto'}}>
          <Typography level="h4" component="h3">VA Cities and Zip Codes</Typography>
          <div>
            {Object.entries(selections).map(([city, zips]) => (
                <div key={city}>
                  <Checkbox
                      checked={selections[city].every(zip => checkedItems[`${city}-${zip}`])}
                      indeterminate={selections[city].some(zip => checkedItems[`${city}-${zip}`]) && !selections[city].every(zip => checkedItems[`${city}-${zip}`])}
                      onChange={handleCheckboxChange}
                      name={city}
                  />
                  {city}
                  {zips.map(zip => (
                      <div key={zip} style={{marginLeft: 20}}>
                        <Checkbox
                            checked={checkedItems[`${city}-${zip}`] ?? false}
                            onChange={handleCheckboxChange}
                            name={`${city}-${zip}`}
                        />
                        {zip}
                      </div>
                  ))}
                </div>
            ))}
          </div>
        </Sheet>
      </Modal>
  );
}