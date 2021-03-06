import unelmaLogo from "../img/unp.png";
import bookmarks from "../img/bookmark.png";
import history from "../img/history.png";
const optionsIcons = { bookmarks, history };
export const handleFavicon = (url, type) => {
  return url?.endsWith("unelmas.com/")
    ? unelmaLogo
    : type === "bookmarks" || type === "history"
    ? optionsIcons[type]
    : `https://s2.googleusercontent.com/s2/favicons?domain_url=${url}`;
};
