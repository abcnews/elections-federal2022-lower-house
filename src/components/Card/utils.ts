const MONTH_SHORTNAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const isThisYear = (date: Date, todayDate = new Date()) => {
  return date.getFullYear() === todayDate.getFullYear();
};

const isToday = (date: Date, todayDate = new Date()) => {
  return (
    isThisYear(date, todayDate) && date.getMonth() === todayDate.getMonth() && date.getDate() === todayDate.getDate()
  );
};

export const formatTimeUpdated = (time: Date) => {
  const timeString = time.toString();
  const hours = time.getHours();

  return isToday(time)
    ? `${hours % 12 || 12}:${String(time.getMinutes()).padStart(2, '0')}${
        hours >= 12 ? 'p' : 'a'
      }m ${timeString.substring(timeString.indexOf('(')).replace(/([a-z\s]+)/g, '')}`
    : `${time.getDate()} ${MONTH_SHORTNAMES[time.getMonth()]}${isThisYear(time) ? '' : ` ${time.getFullYear()}`}`;
};
