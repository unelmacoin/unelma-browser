window.addEventListener("DOMContentLoaded", function () {
  var searchHistory = document.createElement("div");
  searchHistory.id = "search-history";
  var history = document.createElement("ul");
  history.className = "history";
  JSON.parse(localStorage.getItem("search-history"))
    .reverse()
    .forEach(function ({ url, id }) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = url;
      a.textContent = url;
      a.target = "_blank";
      var button = document.createElement("button");
      button.innerHTML = "<i class='fa fa-times'></i>";
      button.addEventListener("click", function () {
        const sHistory = JSON.parse(
          localStorage.getItem("search-history")
        ).filter((item) => item.id !== id);
        
        localStorage.setItem("search-history", JSON.stringify(sHistory));
        li.remove();
        if (history.children.length === 0) {
          var ss = document.createElement("li");
          ss.textContent = "No search history";
          history.appendChild(ss);
        }
      });
      li.appendChild(a);
      li.appendChild(button);
      history.appendChild(li);
    });
  if (history.children.length === 0) {
    var li = document.createElement("li");
    li.textContent = "No search history";
    history.appendChild(li);
  }
  searchHistory.appendChild(history);
  document.body.appendChild(searchHistory);
});
