import {
  SET_TABS,
} from "../../constants/renderer/actions.js";

const tabReducer = (state, action) => {

  switch (action.type) {
    case SET_TABS: {
      return action.payload.tabs;
    }
    default:
      return state;
  }
};
export default tabReducer;
