const Store = require("electron-store");
const { handleSearchHistory } = require("../../utils/handleSearchHistory");
const store = new Store();


module.exports = {
  getSearchHistory: () => store.get("search-history") || [],
  addHistory: (newSearchHistory) => {
    let searchHistoryList = store.get("search-history") || [];
    store.set(
      "search-history",
      handleSearchHistory(newSearchHistory, searchHistoryList)
    );
  },
  removeFromSearchHistroy: (id) => {
    let history = store.get("search-history") || [];
    store.set(
      "search-history",
      history.filter((item) => item.id !== id)
    );
  },
};
