import * as React from 'react';
import "dayjs/locale/pt-br";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

export default function BasicDateCalendar() {
  
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='pt-br'>
      <DateCalendar sx={{ width:'95%'}}/>
    </LocalizationProvider>
  );
}