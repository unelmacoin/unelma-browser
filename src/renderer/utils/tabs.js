import { UPDATE_ACTIVE_TAB } from "../../constants/renderer/actions";
import uniqid from "uniqid";
import { UNELMA_DEFAULT_URL } from "../../constants/global/urls";

export const defaultTab = (windowId) => ({
  id: uniqid(),
  url: UNELMA_DEFAULT_URL,
  active: true,
  windowId,
  title: "Unelma Search",
  loading: false,
  type: "webview",
});

