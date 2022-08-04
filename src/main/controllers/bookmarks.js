const Store = require("electron-store");
const store = new Store();
module.exports = {
  getBookmarks: () => store.get("bookmarks") || [],
  addBookmark: (bookmark, type) => {
    let bookmarks = store.get("bookmarks") || [];
    if (
      !bookmarks.find((item) => item.url === bookmark.url) &&
      type === "webview"
    ) {
      store.set("bookmarks", [bookmark, ...bookmarks]);
    }
  },
  removeFromBookmarks: (url) => {
    let bookmarks = store.get("bookmarks") || [];
    store.set(
      "bookmarks",
      bookmarks.filter((item) => item.url !== url)
    );
  },
};
