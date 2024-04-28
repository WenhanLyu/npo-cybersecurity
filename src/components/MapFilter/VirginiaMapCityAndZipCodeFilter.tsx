'use client';
import React, {useEffect, useState, useCallback} from 'react';
import {Button, Checkbox, IconButton, Input, Modal, Sheet, Typography} from '@mui/joy';
import {Grid, InputAdornment} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
import debounce from 'lodash.debounce';

type CityAndZip = {
  [key: string]: string[]
}

interface VirginiaMapCityAndZipCodeFilterProps {
  selections: CityAndZip,
  isOpen: boolean,
  onClose: () => void,
}

export const VirginiaMapCityAndZipCodeFilter = (props: VirginiaMapCityAndZipCodeFilterProps) => {
  const {selections, isOpen, onClose} = props;
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  const [tempCheckedItems, setTempCheckedItems] = useState<{ [key: string]: boolean }>({});
  const [searchText, setSearchText] = useState('');
  const [filteredSelections, setFilteredSelections] = useState<CityAndZip>({});

  useEffect(() => {
    const initialCheckedItems: { [key: string]: boolean } = {};
    Object.entries(selections).forEach(([city, zips]) => {
      initialCheckedItems[city] = true;
      zips.forEach(zip => {
        initialCheckedItems[`${city}-${zip}`] = true;
      });
    });
    setCheckedItems(initialCheckedItems);
    setTempCheckedItems(initialCheckedItems);
  }, [selections]);

  useEffect(() => {
    const filter = () => {
      const lowerSearchText = searchText.toLowerCase();
      const filtered = Object.entries(selections).reduce((acc, [city, zips]) => {
        if (city.toLowerCase().includes(lowerSearchText) || zips.some(zip => zip.toLowerCase().includes(lowerSearchText))) {
          acc[city] = zips;
        }
        return acc;
      }, {} as CityAndZip);
      setFilteredSelections(filtered);
    };

    const debouncedFilter = debounce(filter, 300);
    debouncedFilter();

    return () => {
      debouncedFilter.cancel();
    };
  }, [searchText, selections]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const clearSearch = () => {
    setSearchText('');
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, checked} = event.target;

    setTempCheckedItems(prev => ({...prev, [name]: checked}));

    if (selections[name]) {
      selections[name].forEach(zip => setTempCheckedItems(prev => ({...prev, [`${name}-${zip}`]: checked})));
    } else {
      const [city] = name.split('-');
      setTempCheckedItems(prev => {
        const newCheckedItems = {...prev, [name]: checked};
        newCheckedItems[city] = selections[city].every(zip => newCheckedItems[`${city}-${zip}`]);
        return newCheckedItems;
      });
    }
  };

  const handleSubmit = () => {
    setCheckedItems(tempCheckedItems);
    onClose();
  };

  const handleCancel = () => {
    setTempCheckedItems(checkedItems);
    onClose();
  };

  const handleToggleAll = useCallback(() => {
    const allChecked = Object.values(tempCheckedItems).every(Boolean);

    // Define newCheckedStates with an explicit type
    const newCheckedStates: { [key: string]: boolean } = {};

    Object.keys(checkedItems).forEach(key => {
      newCheckedStates[key] = !allChecked;
    });
    setTempCheckedItems(newCheckedStates);
  }, [tempCheckedItems, checkedItems]);

  return (
      <Modal open={isOpen} onClose={handleCancel}
             sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Sheet variant={'outlined'} sx={{
          width: 720,
          p: 3,
          height: '60vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '12px'
        }}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Typography level={'h4'} component={'h3'} sx={{flex: '1 1 auto', fontWeight: 'bold'}}>VA Cities and Zip
              Codes</Typography>
            <Button variant={'plain'}
                    onClick={handleCancel}
                    size={'sm'}
            >
              <CloseIcon/>
            </Button>
          </div>
          <Input
              placeholder={'Search by city or zip'}
              onChange={handleSearchChange}
              value={searchText}
              endDecorator={
                <InputAdornment position={'end'}>
                  {searchText && (
                      <IconButton
                          size={'sm'}
                          onClick={clearSearch}
                          aria-label={'clear'}
                      >
                        <CancelIcon/>
                      </IconButton>
                  )}
                </InputAdornment>
              }
              style={{marginTop: '8px'}}
          />
          <div style={{flex: '1 1 auto', overflowY: 'auto', padding: '16px 0'}}>
            {Object.entries(filteredSelections).map(([city, zips]) => (
                <div key={city} style={{marginTop: '16px'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <Checkbox
                        checked={tempCheckedItems[city] && selections[city].every(zip => tempCheckedItems[`${city}-${zip}`])}
                        indeterminate={
                            selections[city].some(zip => tempCheckedItems[`${city}-${zip}`]) &&
                            !selections[city].every(zip => tempCheckedItems[`${city}-${zip}`])
                        }
                        onChange={handleCheckboxChange}
                        name={city}
                    />
                    <span style={{fontWeight: 'bold'}}>{city}</span>
                  </div>
                  <Grid container spacing={1} sx={{ml: 1, width: '95%'}}>
                    {zips.map(zip => (
                        <Grid item key={zip} xs={3}>
                          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                            <Checkbox
                                checked={tempCheckedItems[`${city}-${zip}`] ?? false}
                                onChange={handleCheckboxChange}
                                name={`${city}-${zip}`}
                            />
                            <span>{zip}</span>
                          </div>
                        </Grid>
                    ))}
                  </Grid>
                </div>
            ))}
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0'}}>
            <Button variant={'plain'} onClick={handleToggleAll} style={{marginRight: '8px'}}>
              {Object.values(tempCheckedItems).every(Boolean) ? 'Uncheck All' : 'Check All'}
            </Button>
            <div>
              <Button variant={'outlined'} onClick={handleCancel} style={{marginRight: '12px'}}>Cancel</Button>
              <Button variant={'solid'} color={'primary'} onClick={handleSubmit}>Submit</Button>
            </div>
          </div>
        </Sheet>
      </Modal>
  );
};
