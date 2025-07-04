import { DateFormatter } from "./DateFormatter.js";
import { TimeFormatter } from "./TimeFormatter.js";

export class Clock {
  constructor() {
    this.elements = {
      hours: document.getElementById("hours"),
      minutes: document.getElementById("minutes"),
      day: document.getElementById("day"),
      date: document.getElementById("date"),
    };

    this.lastTime = null;
    this.lastDate = null;
    this.updateInterval = null;
    this.dateUpdateInterval = null;

    this.init();
  }

  init() {
    this.updateTime();
    this.updateDate();
    this.startIntervals();
  }

  startIntervals() {
    this.updateInterval = setInterval(() => this.updateTime(), 1000);
    this.dateUpdateInterval = setInterval(() => this.updateDate(), 60000);
  }

  stopIntervals() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    if (this.dateUpdateInterval) {
      clearInterval(this.dateUpdateInterval);
      this.dateUpdateInterval = null;
    }
  }

  updateTime() {
    const currentTime = TimeFormatter.getCurrentTime();

    // Only update DOM if minute has changed
    if (TimeFormatter.hasMinuteChanged(this.lastTime, currentTime)) {
      this.elements.hours.textContent = currentTime.hours;
      this.elements.minutes.textContent = currentTime.minutes;
      this.lastTime = currentTime;
    }
  }

  updateDate() {
    const currentDate = DateFormatter.getCurrentDate();

    if (DateFormatter.hasDayChanged(this.lastDate, currentDate)) {
      this.elements.day.textContent = currentDate.dayName;
      this.elements.date.textContent =
        DateFormatter.formatLongDate(currentDate);
      this.lastDate = currentDate;
    }
  }

  destroy() {
    this.stopIntervals();
    Object.values(this.elements).forEach((element) => {
      if (element) element.textContent = "";
    });
  }

  getCurrentState() {
    return {
      time: this.lastTime,
      date: this.lastDate,
      isRunning: this.updateInterval !== null,
    };
  }
}
