import { useContext } from 'react';

import { datepickerContext } from './context';

export const useDatepickerContext = () => useContext(datepickerContext);
