import {
  ADD_BOOKMARK,
  SET_BOOKMARKS,
  REMOVE_BOOKMARK,
} from "../../constants/renderer/actions.js";

const bookmarksReducer = (state, action) => {
  switch (action.type) {
    case SET_BOOKMARKS:
      return [...action.payload.bookmarks];
    case ADD_BOOKMARK: {
      window.api.send("add-bookmark", action.payload.bookmark);
      return [action.payload.bookmark, ...state];
    }
    case REMOVE_BOOKMARK: {
      window.api.send("remove-from-bookmarks", action.payload.url);
      return state.filter(({ url }) => url !== action.payload.url);
    }
    default:
      return state;
  }
};
export default bookmarksReducer;
