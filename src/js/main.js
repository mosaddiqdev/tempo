import { BookmarkSidebar } from "./BookmarkSidebar.js";
import { Clock } from "./Clock.js";

class App {
  constructor() {
    this.clock = null;
    this.bookmarkSidebar = null;
    this.init();
  }

  init() {
    this.clock = new Clock();
    this.bookmarkSidebar = new BookmarkSidebar();
  }

  /**
   * Destroy the application
   */
  destroy() {
    if (this.clock) {
      this.clock.destroy();
      this.clock = null;
    }
    if (this.bookmarkSidebar) {
      // Bookmark sidebar cleanup would go here if needed
      this.bookmarkSidebar = null;
    }
  }

  /**
   * Get application state
   * @returns {Object} - Current application state
   */
  getState() {
    return {
      clock: this.clock ? this.clock.getCurrentState() : null,
      bookmarks: this.bookmarkSidebar
        ? {
            isVisible: this.bookmarkSidebar.isVisible,
            bookmarkCount:
              this.bookmarkSidebar.bookmarkManager.bookmarks.length,
          }
        : null,
    };
  }
}

const tempoApp = new App();
window.tempoApp = tempoApp;
