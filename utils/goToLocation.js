const { ipcRenderer } = require("electron");

const goToLocation = (input) => {
 const value =
   input.value.startsWith("http") || input.value.startsWith("https")
     ? input.value
     : `https://${input.value}`;
     input.value = value
  ipcRenderer.send("goToLocation", value);
  // ipcRenderer.on("isLoading", (_, { id }) => {
  //   document.getElementById(id).children[0].textContent = "Loading...";
  // });
  ipcRenderer.on("getInfo", (_, { title, id }) => {
   document.getElementById(id).children[0].textContent =
     title.length > 25 ? `${title.slice(0, 25)}...` : title;
  });
  ipcRenderer.on("change-url", (_, { newURL }) => {
    //console.log(newURL);
    input.value = newURL;
  });
};

module.exports = goToLocation;
