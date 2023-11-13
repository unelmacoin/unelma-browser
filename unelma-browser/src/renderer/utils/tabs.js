import uniqid from "uniqid";
import { UNELMA_DEFAULT_URL } from "../../constants/global/urls";

export const defaultTab = (windowId, inputUrl) => ({
  id: uniqid(),
  url: inputUrl ? inputUrl : UNELMA_DEFAULT_URL,
  active: true,
  windowId,
  title: "Unelma Search",
  loading: false,
  type: "webview",
});