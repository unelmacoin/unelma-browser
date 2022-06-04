const goToLocation = require("../utils/goToLocation");

const LocationForm = () => {
  const locationForm = document.createElement("form");

  const location = document.createElement("input");
  locationForm.id = "location-form";
  location.id = "location-input";
  location.type = "text";
  location.value = "https://www.unelma.xyz/";
  
  locationForm.appendChild(location);
  locationForm.addEventListener("submit", (e) => {
    e.preventDefault();
    goToLocation(location);
  });
  return locationForm;
};
module.exports = LocationForm;