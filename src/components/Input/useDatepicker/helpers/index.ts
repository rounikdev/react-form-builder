export const areSameDay = (dayA: Date, dayB: Date) => {
  return (
    dayA.getDate() === dayB.getDate() &&
    dayA.getMonth() === dayB.getMonth() &&
    dayA.getFullYear() === dayB.getFullYear()
  );
};

export const canBeSelected = ({
  date,
  maxDate,
  minDate
}: {
  date: Date | null;
  maxDate?: Date;
  minDate?: Date;
}) => {
  let can = true;

  if (!date) {
    return false;
  }

  if (minDate) {
    if (date.getFullYear() < minDate.getFullYear()) {
      can = false;
    }

    if (date.getFullYear() === minDate.getFullYear() && date.getMonth() < minDate.getMonth()) {
      can = false;
    }

    if (
      date.getFullYear() === minDate.getFullYear() &&
      date.getMonth() === minDate.getMonth() &&
      date.getDate() < minDate.getDate()
    ) {
      can = false;
    }

    if (
      date.getFullYear() === minDate.getFullYear() &&
      date.getMonth() === minDate.getMonth() &&
      date.getDate() === minDate.getDate() &&
      date.getHours() < minDate.getHours()
    ) {
      can = false;
    }
  }

  if (maxDate) {
    if (date.getFullYear() > maxDate.getFullYear()) {
      can = false;
    }

    if (date.getFullYear() === maxDate.getFullYear() && date.getMonth() > maxDate.getMonth()) {
      can = false;
    }

    if (
      date.getFullYear() === maxDate.getFullYear() &&
      date.getMonth() === maxDate.getMonth() &&
      date.getDate() > maxDate.getDate()
    ) {
      can = false;
    }

    if (
      date.getFullYear() === maxDate.getFullYear() &&
      date.getMonth() === maxDate.getMonth() &&
      date.getDate() === maxDate.getDate() &&
      date.getHours() > maxDate.getHours()
    ) {
      can = false;
    }
  }

  return can;
};

export const constructWeeksInMonth = (days: Date[]) => {
  const weeks: Date[][] = [];
  let currentWeek: Date[] = new Array(7);

  days.forEach((day) => {
    // Make Sunday to have index 6 instead of 0
    // and Monday to be 0 instead of 1:
    const dayIndex = day.getDay() === 0 ? 6 : day.getDay() - 1;

    if (dayIndex === 0) {
      if (currentWeek) {
        weeks.push(currentWeek);
      }
      currentWeek = new Array(7);
    } else {
      currentWeek = currentWeek || new Array(7);
    }
    currentWeek[dayIndex] = day;
  });

  weeks.push(currentWeek);

  if (weeks.length === 5) {
    weeks.push(new Array(7));
  }

  // Fix empty first week:
  if (weeks[0].every((item) => item === undefined)) {
    weeks.splice(0, 1);
    weeks.push(new Array(7));
  }

  // Add days from previous month if needed:
  let indexOfMissingDay = weeks[0].findIndex((item) => item !== undefined);

  while (indexOfMissingDay > 0) {
    indexOfMissingDay = weeks[0].findIndex((item) => item !== undefined);

    const newDate = new Date(weeks[0][indexOfMissingDay]);

    newDate.setDate(newDate.getDate() - 1);

    weeks[0][indexOfMissingDay - 1] = newDate;
  }

  // Add days from the next month if needed:
  indexOfMissingDay = weeks[4].findIndex((item) => item === undefined);

  while (indexOfMissingDay > -1 && indexOfMissingDay <= 6) {
    indexOfMissingDay = weeks[4].findIndex((item) => item === undefined);

    const newDate = new Date(weeks[4][indexOfMissingDay - 1]);

    newDate.setDate(newDate.getDate() + 1);

    weeks[4][indexOfMissingDay] = newDate;
  }

  if (weeks[5].findIndex((item) => item !== undefined) === -1) {
    weeks.splice(5, 1);
  } else {
    // Add days from the next month if needed:
    indexOfMissingDay = weeks[5].findIndex((item) => item === undefined);

    while (indexOfMissingDay > -1 && indexOfMissingDay <= 6) {
      indexOfMissingDay = weeks[5].findIndex((item) => item === undefined);

      let prevDay = weeks[5][indexOfMissingDay - 1];

      if (indexOfMissingDay === 0) {
        prevDay = weeks[4][6];
      }

      const newDate = new Date(prevDay);

      newDate.setDate(newDate.getDate() + 1);

      weeks[5][indexOfMissingDay] = newDate;
    }
  }

  return weeks;
};

export const formatDateInput = (date: Date | null) => {
  if (date === null) {
    return '';
  }

  const day: number = date.getDate();
  let dd = '';

  if (day < 10) {
    dd = `0${day}`;
  } else {
    dd = day.toString();
  }

  const month: number = date.getMonth() + 1;
  let mm = '';

  if (month < 10) {
    mm = `0${month}`;
  } else {
    mm = month.toString();
  }

  const yyyy = date.getFullYear();

  return `${dd}/${mm}/${yyyy}`;
};

export const getDaysInMonth = ({
  month,
  useEndOfDay,
  year
}: {
  month: number;
  useEndOfDay?: boolean;
  year: number;
}) => {
  const now = new Date();

  const m = month != null ? month : now.getMonth();

  const y = year || now.getFullYear();

  let currentMonth = m;

  let currentDay = 1;

  const days = [];

  while (currentMonth === m) {
    let day = new Date(y, m, currentDay);

    if (useEndOfDay) {
      day = new Date(y, m, currentDay, 23, 59, 59);
    }

    currentDay++;

    currentMonth = day.getMonth();

    if (currentMonth === m) {
      days.push(day);
    }
  }
  return days;
};

export const validateDateInput = ({
  dateString,
  useEndOfDay
}: {
  dateString: string;
  useEndOfDay?: boolean;
}) => {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
    return null;
  } else {
    const [dd, mm, yyyy] = dateString.split('/');
    const day = parseInt(dd, 10);
    const month = parseInt(mm, 10) - 1;
    const year = parseInt(yyyy, 10);

    if (year < 1000 || year > 3000 || month < 0 || month > 11) {
      return null;
    }

    const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
      monthLength[1] = 29;
    }

    const isValid = day > 0 && day <= monthLength[month];

    if (isValid) {
      if (useEndOfDay) {
        return new Date(year, month, day, 23, 59, 59);
      } else {
        return new Date(year, month, day);
      }
    } else {
      return null;
    }
  }
};
