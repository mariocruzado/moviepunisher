import { TAction } from "../actionTypes";

export const tokenReducer = (state: string = "", action: TAction) => {
  if (action.type === "SET_TOKEN") {
    return action.newToken;
  }
  if (action.type === "RESET") return "";
  return state;
};
