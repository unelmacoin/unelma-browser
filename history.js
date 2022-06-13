import { categorizeByDate } from "./utils/categorize.js";

window.addEventListener("DOMContentLoaded", function () {
  const searchHistory = document.createElement("div");
  searchHistory.id = "search-history";

  const categoriesList = document.createElement("ul");
  categoriesList.id = "categories-list";
  history.className = "history";
  const searchHistoryArray = JSON.parse(
    localStorage.getItem("search-history") || "[]"
  );
  const categories = categorizeByDate(searchHistoryArray);
  console.log(categories);

  const sortedKeys = Object.keys(categories).sort((a, b) => {
    if (a.includes("Today")) return -1;
    if (b.includes("Today")) return 1;
    if (a.includes("Yesterday")) return -1;
    if (b.includes("Yesterday")) return 1;
    if (a.includes("Last 7 days")) return -1;
    if (b.includes("Last 7 days")) return 1;
    if (a.includes("Older")) return -1;
    if (b.includes("Older")) return 1;
    return 0;
  });

  sortedKeys.forEach((key) => {
    const category = document.createElement("li");
    category.className = "category";
    const categoryTitle = document.createElement("h4");
    categoryTitle.innerText = key;
    category.appendChild(categoryTitle);
    const categoryList = document.createElement("ul");
    categoryList.className = "category-list";
    const history = document.createElement("ul");
    categories[key].forEach((item) => {
      const itemLi = document.createElement("li");
      const itemContent = document.createElement("div");
      itemContent.className = "item-content";
      itemLi.className = "item";
      const itemLink = document.createElement("a");
      const time = document.createElement("div");
      time.className = "time";
      time.innerText = new Date(item.time).toLocaleTimeString();
      let button = document.createElement("button");
      button.innerHTML = "<i class='fa fa-times'></i>";
      button.addEventListener("click", function () {
        const sHistory = JSON.parse(
          localStorage.getItem("search-history")
        ).filter((i) => i.id !== item.id);
        localStorage.setItem("search-history", JSON.stringify(sHistory));
        itemLi.remove();
        if (history.children.length === 0) {
          category.remove();
        }
        if (categoriesList.children.length === 0) {
          let li = document.createElement("li");
          li.textContent = "No search history";
          categoriesList.appendChild(li);
        }
      });
      itemLink.href = item.url;
      itemLink.innerText = item.url.slice(
        item.url.indexOf("//") + 2,
        item.url.indexOf("/", item.url.indexOf("//") + 2)
      );
      itemLink.target = "_blank";
      itemContent.appendChild(time);
      itemContent.appendChild(itemLink);
      itemLi.appendChild(itemContent);
      itemLi.appendChild(button);
      history.appendChild(itemLi);
    });
    category.appendChild(history);
    categoriesList.appendChild(category);
  });

  if (categoriesList.children.length === 0) {
    let li = document.createElement("li");
    li.textContent = "No search history";
    categoriesList.appendChild(li);
  }
  searchHistory.appendChild(categoriesList);
  document.body.appendChild(searchHistory);
});
