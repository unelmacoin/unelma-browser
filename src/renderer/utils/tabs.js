import { UPDATE_ACTIVE_TAB } from "../../constants/renderer/actions";
import uniqid from "uniqid";

export const defaultTab = (windowId) => ({
  id: uniqid(),
  url: "https://unelma.xyz/",
  active: true,
  windowId,
  title: "Unelma Search",
  loading: false,
  type: "webview",
});
export const closeTabs = (dispatcher) => {
  const closeBtns = [...document.querySelectorAll(".close")];
  closeBtns.forEach((btn, index) => {
    if (index !== 0) btn.click();
  });
  window.api.send("reset-window-tabs" + window.id);
  dispatcher({
    type: UPDATE_ACTIVE_TAB,
    payload: {
      tab: {
        url: "https://unelma.xyz/",
      },
    },
  });
};
