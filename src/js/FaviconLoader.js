export class FaviconLoader {
  constructor() {
    this.faviconSources = [
      (domain, size = 32) =>
        `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`,
      (domain) => `https://icons.duckduckgo.com/ip3/${domain}.ico`,
      (domain) => `https://favicon.yandex.net/favicon/${domain}`,
      (domain) => `https://${domain}/favicon.ico`,
      (domain) => `https://${domain}/favicon.png`,
      (domain) => `https://${domain}/apple-touch-icon.png`,
    ];

    this.faviconCache = new Map();
    this.defaultIcon = this.createDefaultIcon();
  }

  async getFaviconUrl(url, size = 32) {
    try {
      const domain = this.extractDomain(url);
      const cacheKey = `${domain}_${size}`;

      if (this.faviconCache.has(cacheKey)) {
        return this.faviconCache.get(cacheKey);
      }

      for (const sourceGenerator of this.faviconSources) {
        const faviconUrl = sourceGenerator(domain, size);

        if (await this.testFaviconUrl(faviconUrl)) {
          this.faviconCache.set(cacheKey, faviconUrl);
          return faviconUrl;
        }
      }

      return this.defaultIcon;
    } catch (error) {
      return this.defaultIcon;
    }
  }

  /**
   * Extract clean domain from URL
   */
  extractDomain(url) {
    try {
      const urlObj = new URL(url);
      let domain = urlObj.hostname;

      // Remove www. prefix for better favicon matching
      if (domain.startsWith("www.")) {
        domain = domain.substring(4);
      }

      return domain;
    } catch (error) {
      // Fallback for malformed URLs
      return url.replace(/^https?:\/\//, "").split("/")[0];
    }
  }

  /**
   * Test if favicon URL is accessible and valid
   */
  async testFaviconUrl(faviconUrl) {
    return new Promise((resolve) => {
      const img = new Image();
      const timeout = setTimeout(() => {
        resolve(false);
      }, 3000); // 3 second timeout

      img.onload = () => {
        clearTimeout(timeout);
        // Check if image has valid dimensions
        resolve(img.width > 0 && img.height > 0);
      };

      img.onerror = () => {
        clearTimeout(timeout);
        resolve(false);
      };

      img.src = faviconUrl;
    });
  }

  createDefaultIcon() {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#666" stroke-width="1.5" fill="#333"/>
        <circle cx="12" cy="12" r="3" fill="#666"/>
      </svg>
    `;

    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }

  /**
   * Preload favicons for better performance
   */
  async preloadFavicons(bookmarks) {
    const promises = bookmarks.map((bookmark) =>
      this.getFaviconUrl(bookmark.url).then((faviconUrl) => {
        bookmark.favicon = faviconUrl;
        return bookmark;
      })
    );

    return Promise.all(promises);
  }

  /**
   * Handle special cases for problematic sites
   */
  getSpecialCaseFavicon(domain) {
    const specialCases = {
      // Sites with known favicon issues
      "youtube.com": "https://www.youtube.com/favicon.ico",
      "google.com": "https://www.google.com/favicon.ico",
      "github.com": "https://github.com/favicon.ico",
      "stackoverflow.com": "https://stackoverflow.com/favicon.ico",
      "reddit.com": "https://www.reddit.com/favicon.ico",

      // Gaming sites (often have custom icons)
      "clashofclans.fandom.com":
        "https://static.wikia.nocookie.net/clashofclans/images/6/64/Favicon.ico",

      // Google services
      "maps.google.com": "https://maps.google.com/favicon.ico",
      "accounts.google.com": "https://accounts.google.com/favicon.ico",
      "gmail.com": "https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico",

      // Banking/financial sites (often have strict CSP)
      "icicibank.com": "https://www.icicibank.com/favicon.ico",
    };

    return specialCases[domain] || null;
  }

  /**
   * Smart favicon loading with all optimizations
   */
  async loadFaviconSmart(url, size = 32) {
    const domain = this.extractDomain(url);

    // 1. Check special cases first
    const specialCase = this.getSpecialCaseFavicon(domain);
    if (specialCase && (await this.testFaviconUrl(specialCase))) {
      return specialCase;
    }

    // 2. Use standard fallback chain
    return this.getFaviconUrl(url, size);
  }

  /**
   * Clear favicon cache (useful for debugging)
   */
  clearCache() {
    this.faviconCache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      size: this.faviconCache.size,
      entries: Array.from(this.faviconCache.keys()),
    };
  }
}
