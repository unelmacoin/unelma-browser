const {
  addBookmark,
  getBookmarks,
  removeFromBookmarks,
} = require("../utils/handleLocalStorage");

const BookmarkBtn = () => {
  const bookmarkBtn = document.createElement("button");
  bookmarkBtn.id = "bookmark-btn";
  bookmarkBtn.innerHTML = '<i class="fa fa-star"></i>';
  bookmarkBtn.addEventListener("click", function () {
    bookmarkBtn.classList.toggle("active");
    const bookmarks = getBookmarks();
    const activeWebview = document.querySelector(".active-webview");
    const url = activeWebview.src;
    if (!bookmarks.find((item) => item.url === url)) {
      addBookmark(url);
    } else {
      removeFromBookmarks(url);
    }
  });
  return bookmarkBtn;
};
module.exports = BookmarkBtn;
