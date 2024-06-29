/**
 * @param {Date} date - The date to calculate the week number for.
 * @returns {string} - The year and week number.
 */
function getYearWeek(date) {
  const startDate = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((date.getDay() + 1 + days) / 7);
  return `${date.getFullYear()}-${weekNumber}`;
}

export default getYearWeek;
