const goToLocation = require("../utils/goToLocation");
const { setBookmarks, getBookmarks } = require("../utils/handleLocalStorage");

const id = () => Math.round(Math.random() * 10000 * Math.random());
const LocationForm = () => {
  const container = document.createElement("div");
  const locationForm = document.createElement("form");
  container.classList.add("location-container");
  const location = document.createElement("input");
  const bookmarkBtn = document.createElement("button");
  locationForm.id = "location-form";
  location.id = "location-input";
  location.type = "text";
  location.value = "https://www.unelma.xyz/";
  bookmarkBtn.id = "bookmark-btn";
  bookmarkBtn.innerHTML = "<i class='fa fa-star'></i>";

  locationForm.appendChild(location);

  bookmarkBtn.type = "button";

  locationForm.addEventListener("submit", (e) => {
    e.preventDefault();
    goToLocation(location);
  });

  bookmarkBtn.addEventListener("click", (e) => {
    console.log("clicked");
    const bookmarks = getBookmarks();
    if (
      !location.value.endsWith("bookmarks.html") &&
      !bookmarks.find((item) => item.url === location.value)
    ) {
      bookmarks.push({ id: id(), url: location.value });
      setBookmarks(bookmarks);
      bookmarkBtn.style.color = "gold";
    }
  });
  container.appendChild(locationForm);
  container.appendChild(bookmarkBtn);
  return container;
};
module.exports = LocationForm;
