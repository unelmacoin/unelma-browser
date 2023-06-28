import unelmaLogo from "../../img/unp.png";
import bookmarks from "../../img/bookmark.png";
import history from "../../img/history.png";
import settings from "../../img/settings.png";
import failLoading from "../../img/fail_loading.png" 
import { UNELMA_DEFAULT_DOMAIN } from "../../constants/global/urls";
const optionsIcons = { bookmarks, history, settings };
export const handleFavicon = (url, type, fail) => {
  if (url?.includes(UNELMA_DEFAULT_DOMAIN)) {
    return unelmaLogo;
  } else if (fail) {
    return failLoading;
  } else if (type === "bookmarks" || type === "history" || type === "settings") {
    return optionsIcons[type];
  } else {
    return `https://s2.googleusercontent.com/s2/favicons?domain_url=${url}`;
  }
};
