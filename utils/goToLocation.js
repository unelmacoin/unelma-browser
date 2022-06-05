const handleSearch = require("./handleSearch");

const goToLocation = (input) => {
  const activeWebview = document.querySelector(".active-webview");
  activeWebview.src = handleSearch(input.value);
  input.value = handleSearch(input.value);
};

module.exports = goToLocation;
