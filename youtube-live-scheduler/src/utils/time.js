export function minutesToDate(min) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setMinutes(min);
  return d;
}
