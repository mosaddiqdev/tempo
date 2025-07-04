chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getBookmarks") {
    getBookmarksData()
      .then((bookmarks) => {
        sendResponse({ success: true, bookmarks });
      })
      .catch((error) => {
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }
});

async function getBookmarksData() {
  try {
    const bookmarkTree = await chrome.bookmarks.getTree();
    const bookmarks = extractBookmarksFromTree(bookmarkTree);
    return bookmarks;
  } catch (error) {
    throw error;
  }
}

function extractBookmarksFromTree(
  bookmarkTree,
  bookmarks = [],
  parentFolder = "other"
) {
  for (const node of bookmarkTree) {
    if (node.url) {
      bookmarks.push({
        id: node.id,
        title: node.title,
        url: node.url,
        originalFolder: parentFolder,
        dateAdded: node.dateAdded,
        parentId: node.parentId,
      });
    } else if (node.children && node.title) {
      extractBookmarksFromTree(
        node.children,
        bookmarks,
        node.title.toLowerCase()
      );
    } else if (node.children) {
      extractBookmarksFromTree(node.children, bookmarks, parentFolder);
    }
  }

  return bookmarks
    .sort((a, b) => (b.dateAdded || 0) - (a.dateAdded || 0))
    .slice(0, 30);
}

chrome.runtime.onInstalled.addListener(() => {
  // TEMPO extension installed
});
