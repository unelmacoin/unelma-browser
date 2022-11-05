import { ADD_AUTH_INFO, REMOVE_FROM_AUTH_INFO } from "../../constants/global/channels.js";
import {
  ADD_PASSWORD,
  REMOVE_PASSWORD,
  SET_PASSWORDS,
} from "../../constants/renderer/actions.js";

const passwordsReducer = (state, action) => {
  switch (action.type) {
    case SET_PASSWORDS:
      return [...action.payload.passwords];
    case ADD_PASSWORD: {
      window.api.send(ADD_AUTH_INFO, action.payload.password);
      return [...state, action.payload.password];
    }
    case REMOVE_PASSWORD: {
      window.api.send(REMOVE_FROM_AUTH_INFO, action.payload.id);
      return state.filter(({ id }) => id !== action.payload.id);
    }
    default:
      return state;
  }
};
export default passwordsReducer;
