import {
  UNELMA_DEFAULT_DOMAIN,
  UNELMA_DEFAULT_URL,
} from "../constants/global/urls";

const getDate = (dateString = new Date(Date.now)) =>
  new Date(dateString).toLocaleDateString();

const removeElmFromList = (id, list = []) =>
  list.filter((elm) => elm.id !== id);

const isDefaultURL = (url) =>
  url === UNELMA_DEFAULT_URL || url.includes(UNELMA_DEFAULT_DOMAIN);
const isExists = (id, list = []) => !!list.find((elm) => elm.id === id);

const isAcceptable = (searchHistory, sreachHistoryList = []) =>
  !isDefaultURL(searchHistory.url) &&
  !isExists(searchHistory.id, sreachHistoryList);

const hasSearchedToday = (searchHistory, sreachHistoryList = []) =>
  sreachHistoryList.find(
    (elm) =>
      elm.url === searchHistory.url &&
      getDate(elm.time) === getDate(searchHistory.time)
  )?.id;

export const handleSearchHistory = (
  newSearchHistory,
  sreachHistoryList = []
) => {
  return isAcceptable(newSearchHistory, sreachHistoryList)
    ? [
        newSearchHistory,
        ...removeElmFromList(
          hasSearchedToday(newSearchHistory, sreachHistoryList),
          sreachHistoryList
        ),
      ]
    : sreachHistoryList;
};
