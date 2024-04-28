'use client';
import React, {useEffect, useState, useCallback} from 'react';
import {Button, Checkbox, IconButton, Input, Modal, Sheet, Typography} from '@mui/joy';
import {Grid, InputAdornment} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
import debounce from 'lodash.debounce';

interface NTEECodeData {
  [key: string]: string;
}

interface HealthcareNteeFilterProps {
  NTEECategories: NTEECodeData;
  NTEECode: NTEECodeData;
  isOpen: boolean;
  onClose: () => void;
}

export const HealthcareNteeFilter = ({
                                       NTEECategories,
                                       NTEECode,
                                       isOpen,
                                       onClose
                                     }: HealthcareNteeFilterProps) => {
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  const [tempCheckedItems, setCheckedItemsTemp] = useState<{ [key: string]: boolean }>({});
  const [searchText, setSearchText] = useState('');
  const [filteredCategories, setFilteredCategories] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    const checkedStates: { [key: string]: boolean } = {};
    Object.entries(NTEECategories).forEach(([category]) => {
      checkedStates[category] = true;
      Object.keys(NTEECode).filter(code => code.startsWith(category)).forEach(code => {
        checkedStates[`${category}-${code}`] = true;
      });
    });
    setCheckedItems(checkedStates);
    setCheckedItemsTemp(checkedStates);
  }, [NTEECategories, NTEECode]);

  useEffect(() => {
    const lowerSearchText = searchText.toLowerCase();
    const filtered = Object.entries(NTEECategories).reduce((acc, [category, description]) => {
      const codes = Object.keys(NTEECode).filter(code => code.startsWith(category) && (NTEECode[code].toLowerCase().includes(lowerSearchText) || description.toLowerCase().includes(lowerSearchText)));
      if (codes.length > 0) {
        acc[category] = codes;
      }
      return acc;
    }, {} as { [key: string]: string[] });
    setFilteredCategories(filtered);
  }, [searchText, NTEECode, NTEECategories]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const clearSearch = () => {
    setSearchText('');
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, checked} = event.target;
    setCheckedItemsTemp(prev => ({...prev, [name]: checked}));
  };

  const handleSubmit = () => {
    setCheckedItems(tempCheckedItems);
    onClose();
  };

  const handleCancel = () => {
    setCheckedItemsTemp(checkedItems);
    onClose();
  };

  const handleToggleAll = useCallback(() => {
    const allChecked = Object.values(tempCheckedItems).every(Boolean);
    const newCheckedStates = Object.keys(tempCheckedItems).reduce((result, key) => {
      result[key] = !allChecked;
      return result;
    }, {} as { [key: string]: boolean });
    setCheckedItemsTemp(newCheckedStates);
  }, [tempCheckedItems]);

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
            <Typography level={'h4'} component={'h3'} sx={{flex: '1 1 auto', fontWeight: 'bold'}}>Healthcare NTEE
              Categories/Code</Typography>
            <Button variant={'plain'}
                    onClick={handleCancel}
                    size={'sm'}
            >
              <CloseIcon/>
            </Button>
          </div>
          <Input
              placeholder={'Search categories or codes'}
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
            {Object.entries(filteredCategories).map(([category, codes]) => (
                <div key={category} style={{marginTop: '16px'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <Checkbox
                        checked={tempCheckedItems[category]}
                        indeterminate={codes.some(code => tempCheckedItems[`${category}-${code}`]) && !codes.every(code => tempCheckedItems[`${category}-${code}`])}
                        onChange={handleCheckboxChange}
                        name={category}
                    />
                    <span style={{fontWeight: 'bold'}}>{`${category} - ${NTEECategories[category]}`}</span>
                  </div>
                  <Grid container spacing={1} sx={{ml: 1, width: '95%'}}>
                    {codes.map(code => (
                        <Grid item key={code} xs={12}>
                          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                            <Checkbox
                                checked={tempCheckedItems[`${category}-${code}`]}
                                onChange={handleCheckboxChange}
                                name={`${category}-${code}`}
                            />
                            <span>{`${code} - ${NTEECode[code]}`}</span>
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
