module.exports = {
  getCurrentTabs: () => {
    return JSON.parse(localStorage.getItem("current-tabs") || "[]");
  },
  setCurrentTabs : (tabs) => {
    localStorage.setItem("current-tabs", JSON.stringify(tabs));
  }
};
