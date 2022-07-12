const { getBookmarks } = require("./handleLocalStorage");

module.exports = {
  handleBookmarksUI: () => {
    const locationInput = document.getElementById("location-input");
    const bookmarks = getBookmarks();
    const bookmarkBtn = document.getElementById("bookmark-btn");
    if (bookmarks.find((item) => item.url === locationInput.value))
      bookmarkBtn.classList.add("active");
    else bookmarkBtn.classList.remove("active");
  },
};
