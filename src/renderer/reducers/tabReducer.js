import {
  ACTIVATE_TAB,
  ADD_TAB,
  REMOVE_TAB,
  UPDATE_ACTIVE_TAB,
  UPDATE_TAB,
  SET_TABS,
} from "../../constants/renderer/actions.js";

const tabReducer = (state, action) => {
  let result = [];
  switch (action.type) {
    case SET_TABS: {
      return action.payload.tabs;
    }
    case ADD_TAB: {
      result = [...state].map((tab) => ({ ...tab, active: false }));
      window.api.send("add-tab", action.payload.tab);
      return [...result, action.payload.tab];
    }
    case REMOVE_TAB: {
      if (state.length === 1) {
        window.api.send("remove-tab", {
          id: action.payload.id,
          windowId: window.id,
        });
        window.api.send("close-window", window.id);
        return state;
      }
      result = [...state];
      window.api.send("remove-tab", {
        id: action.payload.id,
        windowId: window.id,
      });
      const elmIndex = result.findIndex(({ id }) => id === action.payload.id);
      if (result[elmIndex].active) {
        if (elmIndex === 0) {
          result[elmIndex + 1].active = true;
          result = result.filter((tab) => tab.id !== action.payload.id);
          return result;
        }
        result[elmIndex - 1].active = true;
        result = result.filter((tab) => tab.id !== action.payload.id);
        return result;
      }
      result = state.filter((tab) => tab.id !== action.payload.id);
      return result;
    }
    case UPDATE_TAB: {
      window.api.send("update-tab", action.payload.tab);
      result = [...state].map((tab) =>
        tab.id === action.payload.tab.id
          ? {
              ...tab,
              ...action.payload.tab,
            }
          : tab
      );
      return result;
    }
    case ACTIVATE_TAB: {
      window.api.send("activate-tab", action.payload);
      if (action.payload.id) {
        result = [...state].map((tab) =>
          tab.id === action.payload.id
            ? { ...tab, active: true }
            : { ...tab, active: false }
        );
        return result;
      } else {
        result = [...state].map((tab) =>
          tab.type === action.payload.tabType
            ? { ...tab, active: true }
            : { ...tab, active: false }
        );

        return result;
      }
    }
    case UPDATE_ACTIVE_TAB: {
      result = [...state].map((tab) =>
        tab.active ? { ...tab, ...action.payload.tab } : tab
      );
      return result;
    }
    default:
      return state;
  }
};
export default tabReducer;
