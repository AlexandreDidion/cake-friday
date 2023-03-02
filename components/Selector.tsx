import { useState, useEffect } from 'react'

import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import { SelectChangeEvent } from '@mui/material/Select'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

interface SelectOptionsObject {
  id: number
  name: string
  value: string
}

export const Selector = (
  {
    label = 'Select',
    onChoice,
    defaultValue = '',
    minWidth = '5rem',
    options
  }
  :
  {
    label?: string,
    onChoice?: (value: string) => void,
    defaultValue?: string,
    minWidth?: string,
    options: SelectOptionsObject[]
  }
) => {
  const [value, setValue] = useState<string>(defaultValue)

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])


  const handleChange = (e: SelectChangeEvent<string>) => {
    setValue(e.target.value)
    if (onChoice) onChoice(e.target.value)
  }

  return (
    <>
      <FormControl sx={{minWidth: minWidth}}>
        <InputLabel id="select-label">{label}</InputLabel>
        <Select
          labelId="select-label"
          fullWidth
          value={value}
          label={label}
          onChange={handleChange}
        >
          {options.map((o) => (
            <MenuItem key={o.id} value={o.value}>{o.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  )
}
