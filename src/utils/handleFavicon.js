import unelmaLogo from "../img/unp.png";
import bookmarks from "../img/bookmark.png";
import history from "../img/history.png";
import { UNELMA_DEFAULT_DOMAIN } from "../constants/global/urls";
const optionsIcons = { bookmarks, history };
export const handleFavicon = (url, type) => {
  return url?.includes(UNELMA_DEFAULT_DOMAIN)
    ? unelmaLogo
    : type === "bookmarks" || type === "history"
    ? optionsIcons[type]
    : `https://s2.googleusercontent.com/s2/favicons?domain_url=${url}`;
};
