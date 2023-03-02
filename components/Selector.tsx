import styles from '@/styles/Navbar.module.scss'

import { useState, useEffect } from 'react'

import Box from '@mui/material/Box'
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

const emptyOption = Object.freeze({
  id: 0,
  name: '',
  value: ''
})

export const Selector = (
  {
    label = 'Select',
    onChange,
    defaultValue = '',
    minWidth = '5rem',
    options
  }
  :
  {
    label?: string,
    onChange?: () => void,
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
