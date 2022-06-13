import { categorizeByDate } from "./utils/categorize.js";

window.addEventListener("DOMContentLoaded", function () {
  let bookmarks = document.createElement("div");
  bookmarks.id = "bookmarks";

  const categoriesList = document.createElement("ul");
  categoriesList.id = "categories-list";
  const searchHistoryArray = JSON.parse(
    localStorage.getItem("bookmarks") || "[]"
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
    let marks = document.createElement("ul");
    marks.className = "marks";
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
        const sHistory = JSON.parse(localStorage.getItem("bookmarks")).filter(
          (i) => i.id !== item.id
        );
        localStorage.setItem("bookmarks", JSON.stringify(sHistory));
        
        itemLi.remove();
        if (marks.children.length === 0) {
          category.remove();
        }
        if (categoriesList.children.length === 0) {
          let li = document.createElement("li");
          li.textContent = "No Bookmarks";
          categoriesList.appendChild(li);
        }
      });
      itemLink.href = item.url;
      itemLink.innerText = item.url.slice(
        item.url.indexOf("//") + 2,
        item.url.indexOf("/", item.url.indexOf("//") + 2)
      );
      itemContent.appendChild(time);
      itemContent.appendChild(itemLink);
      itemLi.appendChild(itemContent);
      itemLi.appendChild(button);
      marks.appendChild(itemLi);
      
    });
    category.appendChild(marks);
    categoriesList.appendChild(category);
  });

  if (categoriesList.children.length === 0) {
    let li = document.createElement("li");
    li.textContent = "No Bookmarks";
    categoriesList.appendChild(li);
  }
  bookmarks.appendChild(categoriesList);
  document.body.appendChild(bookmarks);
});
