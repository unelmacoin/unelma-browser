const addTab = require("../utils/addTab");
const {
  getCurrentTabs,
} = require("../utils/handleLocalStorage");

const OptionsBar = () => {
  const optionsBar = document.createElement("div");
  optionsBar.id = "options-bar";
  const history = document.createElement("button");
  const bookmarks = document.createElement("button");
  history.id = "history";
  bookmarks.id = "bookmarks";
  history.innerHTML = "<i class='fa fa-history'></i>";
  bookmarks.innerHTML = "<i class='fa fa-bookmark'></i>";
  history.addEventListener("click", function () {
    const historyTab = getCurrentTabs().find(
      (item) => item.url === "history.html"
    );
    if (!historyTab) {
      addTab("history.html");
    }
  });
  bookmarks.addEventListener("click", function () {
    const bookmarksTab = getCurrentTabs().find(
      (item) => item.url === "bookmarks.html"
    );

    if (!bookmarksTab) {
      addTab("bookmarks.html");
    }
  });
  optionsBar.appendChild(history);
  optionsBar.appendChild(bookmarks);
  return optionsBar;
};
module.exports = OptionsBar;
