import { UPDATE_ACTIVE_TAB } from "./actions";
import { generateId } from "./generateId";
import { handleFavicon } from "./handleFavicon";
import { resetWindowTabs } from "./handleLocalStorage";

export const defaultTab = () => ({
  id: generateId(),
  url: "https://unelma.xyz/",
  active: true,
  title: "Unelma Search",
  favIcon: handleFavicon("https://unelma.xyz/"),
  loading: false,
  type: "webview",
});
export const closeTabs = (dispatcher) => {
  const closeBtns = [...document.querySelectorAll(".close")];
  closeBtns.forEach((btn, index) => {
    if (index !== 0) btn.click();
  });
  resetWindowTabs()
  dispatcher({
    type: UPDATE_ACTIVE_TAB,
    url: "https://unelma.xyz/",
  });
};
