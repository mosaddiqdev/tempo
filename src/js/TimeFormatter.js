export class TimeFormatter {
  static formatHours(hours) {
    return hours.toString().padStart(2, "0");
  }

  static formatMinutes(minutes) {
    return minutes.toString().padStart(2, "0");
  }

  static formatSeconds(seconds) {
    return seconds.toString().padStart(2, "0");
  }

  static getCurrentTime() {
    const now = new Date();
    return {
      hours: this.formatHours(now.getHours()),
      minutes: this.formatMinutes(now.getMinutes()),
      seconds: this.formatSeconds(now.getSeconds()),
      raw: {
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: now.getSeconds(),
      },
    };
  }

  static to12Hour(hours) {
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return {
      hours: displayHours,
      period: period,
      formatted: this.formatHours(displayHours),
    };
  }

  /**
   * Check if time has changed significantly (minute level)
   * @param {Object} oldTime - Previous time object
   * @param {Object} newTime - Current time object
   * @returns {boolean} - True if minute has changed
   */
  static hasMinuteChanged(oldTime, newTime) {
    if (!oldTime || !newTime) return true;
    return oldTime.raw.minutes !== newTime.raw.minutes;
  }
}
