/**
 * Returns a time-based greeting using browser/device local time:
 * - 05:00–11:59 -> Good morning
 * - 12:00–16:59 -> Good afternoon
 * - 17:00–20:59 -> Good evening
 * - 21:00–04:59 -> Good night
 *
 * @param date Optional Date object (defaults to current local date/time: new Date())
 * @returns Time-based greeting string
 */
export function getTimeBasedGreeting(date: Date = new Date()): string {
  const hours = date.getHours();

  if (hours >= 5 && hours < 12) {
    return 'Good morning';
  } else if (hours >= 12 && hours < 17) {
    return 'Good afternoon';
  } else if (hours >= 17 && hours < 21) {
    return 'Good evening';
  } else {
    return 'Good night';
  }
}
