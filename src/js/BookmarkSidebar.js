/**
 * BookmarkSidebar - Handles the left-side hover bookmark interface
 * Optimized based on psychological research for best UX
 */
import { BookmarkManager } from "./BookmarkManager.js";

export class BookmarkSidebar {
  constructor() {
    this.bookmarkManager = new BookmarkManager();
    this.isVisible = false;
    this.hoverTimeout = null;
    this.hideTimeout = null;

    // Psychological timing constants (based on research)
    this.HOVER_DELAY = 150; // 150ms prevents accidental triggers
    this.HIDE_DELAY = 300; // 300ms allows for mouse movement
    this.ANIMATION_DURATION = 300; // 300ms feels natural

    this.init();
  }

  /**
   * Initialize the sidebar
   */
  async init() {
    await this.bookmarkManager.loadBookmarks();
    this.createSidebarElements();
    this.attachEventListeners();
    this.renderBookmarks();
  }

  /**
   * Create sidebar DOM elements
   */
  createSidebarElements() {
    // Create hover trigger zone (invisible)
    this.hoverZone = document.createElement("div");
    this.hoverZone.className = "bookmark-hover-zone";

    // Create sidebar container
    this.sidebar = document.createElement("div");
    this.sidebar.className = "bookmark-sidebar";

    // Create sidebar content
    this.sidebarContent = document.createElement("div");
    this.sidebarContent.className = "bookmark-sidebar-content";

    // Create header
    this.header = document.createElement("div");
    this.header.className = "bookmark-header";
    this.header.innerHTML = `
      <h3>Bookmarks</h3>
      <div class="bookmark-count">0 bookmarks</div>
    `;

    // Create bookmarks container
    this.bookmarksContainer = document.createElement("div");
    this.bookmarksContainer.className = "bookmarks-container";

    // Assemble sidebar
    this.sidebarContent.appendChild(this.header);
    this.sidebarContent.appendChild(this.bookmarksContainer);
    this.sidebar.appendChild(this.sidebarContent);

    // Add to DOM
    document.body.appendChild(this.hoverZone);
    document.body.appendChild(this.sidebar);
  }

  /**
   * Attach event listeners with psychological timing
   */
  attachEventListeners() {
    // Hover zone events
    this.hoverZone.addEventListener("mouseenter", () => {
      this.clearTimeouts();
      this.hoverTimeout = setTimeout(() => {
        this.showSidebar();
      }, this.HOVER_DELAY);
    });

    this.hoverZone.addEventListener("mouseleave", () => {
      this.clearTimeouts();
      this.scheduleHide();
    });

    // Sidebar events
    this.sidebar.addEventListener("mouseenter", () => {
      this.clearTimeouts();
    });

    this.sidebar.addEventListener("mouseleave", () => {
      this.scheduleHide();
    });

    // Prevent accidental triggers when scrolling
    document.addEventListener("wheel", () => {
      if (this.hoverTimeout) {
        clearTimeout(this.hoverTimeout);
        this.hoverTimeout = null;
      }
    });
  }

  /**
   * Clear all timeouts
   */
  clearTimeouts() {
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  /**
   * Schedule sidebar hide with delay
   */
  scheduleHide() {
    this.hideTimeout = setTimeout(() => {
      this.hideSidebar();
    }, this.HIDE_DELAY);
  }

  /**
   * Show sidebar with smooth animation
   */
  showSidebar() {
    if (this.isVisible) return;

    this.isVisible = true;
    this.sidebar.classList.add("visible");

    // Update bookmark count
    this.updateBookmarkCount();
  }

  /**
   * Hide sidebar with smooth animation
   */
  hideSidebar() {
    if (!this.isVisible) return;

    this.isVisible = false;
    this.sidebar.classList.remove("visible");
  }

  /**
   * Render bookmarks as simple list
   */
  async renderBookmarks() {
    const bookmarks = this.bookmarkManager.getAllBookmarks();
    this.bookmarksContainer.innerHTML = "";

    // Create simple bookmarks list
    const bookmarksList = document.createElement("div");
    bookmarksList.className = "bookmarks-list";

    bookmarks.forEach((bookmark) => {
      const bookmarkElement = this.createBookmarkElement(bookmark);
      bookmarksList.appendChild(bookmarkElement);
    });

    this.bookmarksContainer.appendChild(bookmarksList);
    this.updateBookmarkCount();
  }

  /**
   * Create individual bookmark element
   */
  createBookmarkElement(bookmark) {
    const bookmarkDiv = document.createElement("div");
    bookmarkDiv.className = "bookmark-item";

    bookmarkDiv.innerHTML = `
      <div class="bookmark-favicon">
        <img src="${bookmark.favicon}" alt="${bookmark.title}">
      </div>
      <div class="bookmark-info">
        <div class="bookmark-title">${bookmark.title}</div>
        <div class="bookmark-url">${new URL(bookmark.url).hostname}</div>
      </div>
    `;

    // Add error handler for favicon (CSP-compliant)
    const faviconImg = bookmarkDiv.querySelector(".bookmark-favicon img");
    faviconImg.addEventListener("error", () => {
      faviconImg.src =
        'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23666"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>';
    });

    // Click handler
    bookmarkDiv.addEventListener("click", () => {
      this.bookmarkManager.recordVisit(bookmark.id);
      window.open(bookmark.url, "_blank");
      this.hideSidebar();
    });

    return bookmarkDiv;
  }

  /**
   * Update bookmark count display
   */
  updateBookmarkCount() {
    const count = this.bookmarkManager.bookmarks.length;
    const countElement = this.header.querySelector(".bookmark-count");
    if (countElement) {
      countElement.textContent = `${count} bookmark${count !== 1 ? "s" : ""}`;
    }
  }

  /**
   * Add new bookmark (for future extension)
   */
  addBookmark(title, url) {
    const bookmark = this.bookmarkManager.addBookmark(title, url);
    this.renderBookmarks();
    return bookmark;
  }

  /**
   * Remove bookmark (for future extension)
   */
  removeBookmark(id) {
    this.bookmarkManager.removeBookmark(id);
    this.renderBookmarks();
  }
}
