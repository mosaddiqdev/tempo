/**
 * DateFormatter - Handles date formatting and utilities
 */
export class DateFormatter {
  static dayNames = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 
    'Thursday', 'Friday', 'Saturday'
  ];

  static monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  static shortMonthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  /**
   * Get current date information
   * @returns {Object} - Object with date components
   */
  static getCurrentDate() {
    const now = new Date();
    return {
      dayOfWeek: now.getDay(),
      dayOfMonth: now.getDate(),
      month: now.getMonth(),
      year: now.getFullYear(),
      dayName: this.dayNames[now.getDay()],
      monthName: this.monthNames[now.getMonth()],
      shortMonthName: this.shortMonthNames[now.getMonth()]
    };
  }

  /**
   * Format date as "Month Day, Year"
   * @param {Object} dateObj - Date object from getCurrentDate()
   * @returns {string} - Formatted date string
   */
  static formatLongDate(dateObj) {
    return `${dateObj.monthName} ${dateObj.dayOfMonth}, ${dateObj.year}`;
  }

  /**
   * Format date as "Mon DD, YYYY"
   * @param {Object} dateObj - Date object from getCurrentDate()
   * @returns {string} - Formatted short date string
   */
  static formatShortDate(dateObj) {
    return `${dateObj.shortMonthName} ${dateObj.dayOfMonth}, ${dateObj.year}`;
  }

  /**
   * Get ordinal suffix for day (1st, 2nd, 3rd, etc.)
   * @param {number} day - Day of month
   * @returns {string} - Ordinal suffix
   */
  static getOrdinalSuffix(day) {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }

  /**
   * Format date with ordinal (January 1st, 2025)
   * @param {Object} dateObj - Date object from getCurrentDate()
   * @returns {string} - Formatted date with ordinal
   */
  static formatOrdinalDate(dateObj) {
    const suffix = this.getOrdinalSuffix(dateObj.dayOfMonth);
    return `${dateObj.monthName} ${dateObj.dayOfMonth}${suffix}, ${dateObj.year}`;
  }

  /**
   * Check if date has changed (day level)
   * @param {Object} oldDate - Previous date object
   * @param {Object} newDate - Current date object
   * @returns {boolean} - True if day has changed
   */
  static hasDayChanged(oldDate, newDate) {
    if (!oldDate || !newDate) return true;
    return oldDate.dayOfWeek !== newDate.dayOfWeek || 
           oldDate.dayOfMonth !== newDate.dayOfMonth;
  }
}
