export const formatDate = (date: Date): string => {
  return date.toISOString();
};

export const monthsName = [ "January", "February", "March", "April", "May", "June", "July", "Aug", "Sept", "Okt", "Nov", "Des" ];

export const formatDateSince = (postDate: Date): string => {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

  const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "d", seconds: 86400 },
      { label: "h", seconds: 3600 },
      { label: "m", seconds: 60 },
      { label: "s", seconds: 1 },
  ];

  for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count > 0) {
          return `${count} ${interval.label}${count > 1 ? '' : ''}`;
      }
  }

  return "baru saja";
}
