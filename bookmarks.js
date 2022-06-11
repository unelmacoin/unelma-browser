window.addEventListener("DOMContentLoaded", function () {
  var bookmarks = document.createElement("div");
  bookmarks.id = "bookmarks";
  var marks = document.createElement("ul");
  marks.className = "marks";
  console.log(JSON.parse(localStorage.getItem("bookmarks")));
  JSON.parse(localStorage.getItem("bookmarks"))
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
        const sHistory = JSON.parse(localStorage.getItem("bookmarks")).filter(
          (item) => item.id !== id
        );

        localStorage.setItem("bookmarks", JSON.stringify(sHistory));
        li.remove();
        if (marks.children.length === 0) {
          var ss = document.createElement("li");
          ss.textContent = "No Bookmarks";
          marks.appendChild(ss);
        }
      });
      li.appendChild(a);
      li.appendChild(button);
      marks.appendChild(li);
    });
  if (marks.children.length === 0) {
    var li = document.createElement("li");
    li.textContent = "No Bookmarks";
    marks.appendChild(li);
  }
  bookmarks.appendChild(marks);
  document.body.appendChild(bookmarks);
});
