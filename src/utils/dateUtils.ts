const todayFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' });

export const getTodayDateString = (): string => {
  return todayFormatter.format(new Date());
};
