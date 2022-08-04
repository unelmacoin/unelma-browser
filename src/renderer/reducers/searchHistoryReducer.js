import {
  ADD_SEARCH_HISTORY,
  SET_SEARCH_HISTORY,
  REMOVE_SEARCH_HISTORY,
} from "../../constants/renderer/actions.js";
import { handleSearchHistory } from "../../utils/handleSearchHistory.js";

const searchHistoryReducer = (state, action) => {
  switch (action.type) {
    case SET_SEARCH_HISTORY:
      return [...action.payload.searchHistory];
    case ADD_SEARCH_HISTORY: {
      window.api.send("add-history", action.payload.history);
      return handleSearchHistory(action.payload.history , state);
    }
    case REMOVE_SEARCH_HISTORY: {
      window.api.send("remove-from-search-histroy", action.payload.id);
      return state.filter(({ id }) => id !== action.payload.id);
    }
    default:
      return state;
  }
};
export default searchHistoryReducer;
