const Store = require("electron-store");
const store = new Store();
module.exports = {
  getBookmarks: () => store.get("bookmarks") || [],
  addBookmark: (bookmark) => {
    let bookmarks = store.get("bookmarks") || [];
    if (!bookmarks.find((item) => item.url === bookmark.url)) {
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
