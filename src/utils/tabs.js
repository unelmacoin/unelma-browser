import { generateId } from "./generateId";
export const defaultTab = () => ({
  id: generateId(),
  url: "https://unelmas.com/",
  active: true,
  title: "Unelma Search",
  loading: false,
  type: "webview",
});