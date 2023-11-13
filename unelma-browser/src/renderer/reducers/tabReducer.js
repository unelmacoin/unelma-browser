import {
  SET_TABS,
} from "../../constants/renderer/actions.js";

const tabReducer = (state, action) => {
  if (action.type === SET_TABS ) return action.payload.tabs;
      return state;
};
export default tabReducer;
