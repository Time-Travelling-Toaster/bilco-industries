import React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const MultiSelectChip = ({ items, label, selectedItems, setSelectedItems }) => {
    const theme = useTheme();
    const getNameFromId = (id) => {
        const { name = "" } = items.find(item => item.id === id) || {};
        return name;
    }

    const geIdFromName = (name) => {
        const { id } = items.find(item => item.name === name);
        return id;
    }

    const getStyles = (value) => {
        const selectedId = geIdFromName(value);
        return {
            color:
                selectedItems.findIndex((id) => id === selectedId) === -1
                    ? theme.palette.text.main
                    : theme.palette.secondary.main,
        };
    }  

    return (
        <div>
            <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel>{label}</InputLabel>
                <Select
                    multiple
                    value={selectedItems}
                    onChange={({ target: { value } }) => {
                        setSelectedItems(
                            typeof value === 'string' ? value.split(',') : value,
                        );
                    }}
                    input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((id) => 
                                <Chip sx={{ textTransform: "capitalize", color: theme.palette.secondary.main }} key={id} label={getNameFromId(id)} />
                            )}
                        </Box>
                    )}
                    MenuProps={MenuProps}
                >
                    {items.map(({ name, id }) => (
                        <MenuItem
                            key={id}
                            value={id}
                            style={getStyles(name)}
                            sx={{ textTransform: "capitalize" }}
                        >
                            {name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}

export default MultiSelectChip;