import {
  ADD_PASSWORD,
  REMOVE_PASSWORD,
  SET_PASSWORDS,
} from "../../constants/renderer/actions.js";

const passwordsReducer = (state, action) => {
  //   let result;
  switch (action.type) {
    case SET_PASSWORDS:
      return [...action.payload.passwords];
    case ADD_PASSWORD: {
      window.api.send("add-auth-info", action.payload.password);
      return [...state, action.payload.password];
    }
    case REMOVE_PASSWORD: {
      window.api.send("remove-from-auth-info", action.payload.id);
      return state.filter(({ id }) => id !== action.payload.id);
    }
    default:
      return state;
  }
};
export default passwordsReducer;
