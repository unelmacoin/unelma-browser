export const CREATE_WINDOW = "CREATE_WINDOW";
export const RESET_ALL_TABS = "RESET_ALL_TABS";
export const MAXIMIZE = "MAXIMIZE";
export const UN_MAXIMIZE = "UN_MAXIMIZE";
export const MINIMIZE = "MINIMIZE";
export const CLOSE_WINDOW = "CLOSE_WINDOW";
export const ADD_BOOKMARK = "ADD_BOOKMARK";
export const REMOVE_FROM_BOOKMARKS = "REMOVE_FROM_BOOKMARKS";
export const ADD_AUTH_INFO = "ADD_AUTH_INFO";
export const REMOVE_FROM_AUTH_INFO = "REMOVE_FROM_AUTH_INFO";
export const ADD_HISTORY = "ADD_HISTORY";
export const REMOVE_FROM_SEARCH_HISTORY = "REMOVE_FROM_SEARCH_HISTORY";
export const RESET_WINDOW_TABS = "RESET_WINDOW_TABS";
export const ADD_TAB = "ADD_TAB";
export const REMOVE_TAB = "REMOVE_TAB";
export const UPDATE_TAB = "UPDATE_TAB";
export const ACTIVATE_TAB = "ACTIVATE_TAB";
export const UPDATE_ACTIVE_TAB = "UPDATE_ACTIVE_TAB";
export const GO_TO_LOCATION = "GO_TO_LOCATION";
export const ACTIVATE_VIEW = "ACTIVATE_VIEW";
export const ADD_VIEW = "ADD_VIEW";
export const REMOVE_VIEW = "REMOVE_VIEW";
export const TOGGLE_WINDOW = "TOGGLE_WINDOW";
export const HIDE_VIEWS = "HIDE_VIEWS";
export const SHOW_VIEWS = "SHOW_VIEWS";
export const GO_FORWARD = "GO_FORWARD";
export const GO_BACK = "GO_BACK";
export const RELOAD = "RELOAD";
export const SAVE_LOGIN_INFO = "SAVE_LOGIN_INFO";
export const RE_ORDER_VIEWS = "RE_ORDER_VIEWS";
export const REQUEST_START = "REQUEST_START";
export const FINISH_NAVIGATE = "FINISH_NAVIGATE";

export const WINDOW_READY = "WINDOW_READY";
export const GET_CURRENT_TABS = "GET_CURRENT_TABS";
export const GET_SEARCH_HISTORY = "GET_SEARCH_HISTORY";
export const GET_BOOKMARKS = "GET_BOOKMARKS";
export const GET_AUTH_INFO = "GET_AUTH_INFO";
export const IS_MAXIMIZED = "IS_MAXIMIZED";
export const GET_WINDOWS_NUMBER = "GET_WINDOWS_NUMBER";
export const CATCH_LOGIN_INFO = "CATCH_LOGIN_INFO";
export const GET_LOGIN_INFO = "GET_LOGIN_INFO";
export const OPEN_SIDEBAR = "OPEN_SIDEBAR";
export const LOGIN_INFO = "LOGIN_INFO";
export const SEND_CHANNELS = [
  CREATE_WINDOW,
  RESET_ALL_TABS,
  MAXIMIZE,
  UN_MAXIMIZE,
  MINIMIZE,
  CLOSE_WINDOW,
  ADD_BOOKMARK,
  REMOVE_FROM_BOOKMARKS,
  ADD_AUTH_INFO,
  REMOVE_FROM_AUTH_INFO,
  ADD_HISTORY,
  REMOVE_FROM_SEARCH_HISTORY,
  RESET_WINDOW_TABS,
  ADD_TAB,
  REMOVE_TAB,
  UPDATE_TAB,
  ACTIVATE_TAB,
  UPDATE_ACTIVE_TAB,
  GO_TO_LOCATION,
  ACTIVATE_VIEW,
  ADD_VIEW,
  REMOVE_VIEW,
  TOGGLE_WINDOW,
  HIDE_VIEWS,
  SHOW_VIEWS,
  GO_FORWARD,
  GO_BACK,
  RELOAD,
  SAVE_LOGIN_INFO,
  RE_ORDER_VIEWS,
];
export const RECIEVE_CHANNELS = [
  WINDOW_READY,
  GET_CURRENT_TABS,
  GET_SEARCH_HISTORY,
  GET_BOOKMARKS,
  GET_AUTH_INFO,
  IS_MAXIMIZED,
  GET_WINDOWS_NUMBER,
  CATCH_LOGIN_INFO,
  GET_LOGIN_INFO,
  OPEN_SIDEBAR,
];

export const mergeChannel = (channel, id) => `${channel}-${id}`;
