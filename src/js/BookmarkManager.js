import { FaviconLoader } from "./FaviconLoader.js";

export class BookmarkManager {
  constructor() {
    this.bookmarks = [];
    this.faviconLoader = new FaviconLoader();
    this.loadBookmarks();
  }

  async loadBookmarks() {
    try {
      if (typeof chrome !== "undefined" && chrome.runtime) {
        const response = await this.sendMessageToBackground("getBookmarks");
        if (response.success) {
          this.bookmarks = await this.processBookmarksFromBackground(
            response.bookmarks
          );
        } else {
          throw new Error(response.error || "Failed to get bookmarks");
        }
      } else {
        const stored = localStorage.getItem("tempoBookmarks");
        this.bookmarks = stored
          ? JSON.parse(stored)
          : await this.getDefaultBookmarks();
      }
    } catch (error) {
      this.bookmarks = await this.getDefaultBookmarks();
    }
  }

  async sendMessageToBackground(action, data = {}) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ action, ...data }, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(response);
        }
      });
    });
  }

  async processBookmarksFromBackground(bookmarks) {
    const bookmarksWithFavicons = await this.faviconLoader.preloadFavicons(
      bookmarks.map((bookmark) => ({
        ...bookmark,
        lastVisited: Date.now(),
        visitCount: 0,
      }))
    );
    return bookmarksWithFavicons;
  }

  /**
   * Extract bookmarks from Chrome bookmark tree - RESPECTING USER'S FOLDERS
   */
  extractBookmarks(bookmarkTree, bookmarks = []) {
    for (const node of bookmarkTree) {
      if (node.url) {
        bookmarks.push({
          id: node.id,
          title: node.title,
          url: node.url,
          favicon: `chrome://favicon/${node.url}`,
          lastVisited: Date.now(),
          visitCount: 0,
        });
      } else if (node.children) {
        // Recursively process folders
        this.extractBookmarks(node.children, bookmarks);
      }
    }
    return bookmarks.slice(0, 30); // Limit to 30 most recent
  }

  /**
   * Get default bookmarks for demo/fallback
   */
  async getDefaultBookmarks() {
    const defaultBookmarks = [
      {
        id: "1",
        title: "GitHub",
        url: "https://github.com",
      },
      {
        id: "2",
        title: "YouTube",
        url: "https://youtube.com",
      },
      {
        id: "3",
        title: "Gmail",
        url: "https://gmail.com",
      },
      {
        id: "4",
        title: "Reddit",
        url: "https://reddit.com",
      },
      {
        id: "5",
        title: "Amazon",
        url: "https://amazon.com",
      },
    ];

    // Load favicons for default bookmarks
    return await this.faviconLoader.preloadFavicons(defaultBookmarks);
  }

  /**
   * Get all bookmarks as simple list
   */
  getAllBookmarks() {
    return this.bookmarks;
  }

  /**
   * Add a new bookmark
   */
  addBookmark(title, url) {
    const bookmark = {
      id: Date.now().toString(),
      title,
      url,
      favicon: `https://www.google.com/s2/favicons?domain=${
        new URL(url).hostname
      }`,
      category: "other",
      lastVisited: Date.now(),
      visitCount: 0,
    };

    this.bookmarks.unshift(bookmark);
    this.saveBookmarks();

    return bookmark;
  }

  /**
   * Remove a bookmark
   */
  removeBookmark(id) {
    this.bookmarks = this.bookmarks.filter((bookmark) => bookmark.id !== id);
    this.saveBookmarks();
  }

  /**
   * Update bookmark visit count
   */
  recordVisit(id) {
    const bookmark = this.bookmarks.find((b) => b.id === id);
    if (bookmark) {
      bookmark.visitCount++;
      bookmark.lastVisited = Date.now();
      this.saveBookmarks();
    }
  }

  /**
   * Save bookmarks to localStorage
   */
  saveBookmarks() {
    try {
      localStorage.setItem("tempoBookmarks", JSON.stringify(this.bookmarks));
    } catch (error) {
      // Silent fail for localStorage
    }
  }
}
