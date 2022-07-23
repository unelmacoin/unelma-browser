const { ipcRenderer } = window.require("electron/renderer");
import { UPDATE_ACTIVE_TAB } from "./actions";
import { generateId } from "./generateId";
import { handleFavicon } from "./handleFavicon";
// import { resetWindowTabs } from "./handleLocalStorage";

export const defaultTab = () => ({
  id: generateId(),
  url: "https://unelmas.com/",
  active: true,
  title: "Unelma Search",
  loading: false,
  type: "webview",
});
export const closeTabs = (dispatcher) => {
  const closeBtns = [...document.querySelectorAll(".close")];
  closeBtns.forEach((btn, index) => {
    if (index !== 0) btn.click();
  });
  ipcRenderer.send("reset-window-tabs" + window.id);
  dispatcher({
    type: UPDATE_ACTIVE_TAB,
    url: "https://unelmas.com/",
  });
};
