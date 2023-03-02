import { useState, useEffect } from 'react'

import TextField from '@mui/material/TextField'
import dayjs, { Dayjs } from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'



export const DayPicker = ({label = 'Pick a date', initialDate = dayjs(), onNewDate} : {label?: string, initialDate: Dayjs, onNewDate: (date: Dayjs) => void}) => {
  const [day, setDay] = useState(initialDate)

  useEffect(() => {
    setDay(initialDate)
  }, [initialDate])


  const handleChange = (value: Dayjs | null) => {
    if (!value) return

    setDay(value)
    if (onNewDate) onNewDate(value)
  }

  return (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DesktopDatePicker
      label={label}
      inputFormat="DD/MM/YYYY"
      value={day}
      onChange={handleChange}
      renderInput={(params) => <TextField {...params} />}
    />
  </LocalizationProvider>
  )
}
