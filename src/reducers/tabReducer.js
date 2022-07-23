const { ipcRenderer } = window.require("electron");
import {
  ACTIVATE_TAB,
  ADD_TAB,
  REMOVE_TAB,
  UPDATE_ACTIVE_TAB,
  UPDATE_TAB,
  SET_TABS,
} from "../utils/actions";
// import { setCurrentTabs } from "../utils/handleLocalStorage";

const tabReducer = (state, action) => {
  let result = [];
  switch (action.type) {
    case SET_TABS: {
      // ipcRenderer.send("set-current-tabs" + window.id, action.tabs);
      return action.tabs;
    }
    case ADD_TAB: {
      result = [...state].map((tab) => ({ ...tab, active: false }));
      ipcRenderer.send("set-current-tabs" + window.id, [...result, action.tab]);
      return [...result, action.tab];
    }
    case REMOVE_TAB: {
      if (state.length === 1) {
        ipcRenderer.send("close-window", window.id);
        return state;
      }
      result = [...state];
      const elmIndex = result.findIndex(({ id }) => id === action.id);
      if (result[elmIndex].active) {
        if (elmIndex === 0) {
          result[elmIndex + 1].active = true;
          result = result.filter((tab) => tab.id !== action.id);
            ipcRenderer.send("set-current-tabs" + window.id, result);
         
          return result;
        }
        result[elmIndex - 1].active = true;
        result = result.filter((tab) => tab.id !== action.id);
         ipcRenderer.send("set-current-tabs" + window.id, result);
        return result;
      }
      result = state.filter((tab) => tab.id !== action.id);
      ipcRenderer.send("set-current-tabs" + window.id, result);
      return result;
    }
    case UPDATE_TAB: {
      result = [...state].map((tab) =>
        tab.id === action.tab.id
          ? {
              ...tab,
              ...action.tab,
            }
          : tab
      );
    ipcRenderer.send("set-current-tabs" + window.id, result);
      return result;
    }
    case ACTIVATE_TAB: {
      if (action.id) {
        result = [...state].map((tab) =>
          tab.id === action.id
            ? { ...tab, active: true }
            : { ...tab, active: false }
        );
        ipcRenderer.send("set-current-tabs" + window.id, result);
        return result;
      } else {
        result = [...state].map((tab) =>
          tab.type === action.tabType
            ? { ...tab, active: true }
            : { ...tab, active: false }
        );
       ipcRenderer.send("set-current-tabs" + window.id, result);
        return result;
      }
    }
    case UPDATE_ACTIVE_TAB: {
      result = [...state].map((tab) =>
        tab.active ? { ...tab, url: action.url } : tab
      );
    ipcRenderer.send("set-current-tabs" + window.id, result);
      return result;
    }
    default:
      return state;
  }
};
export default tabReducer;
