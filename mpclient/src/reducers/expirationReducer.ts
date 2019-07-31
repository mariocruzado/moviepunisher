import { TAction } from "../actionTypes";

export const loginExpireReducer = (state: number = -1, action: TAction) => {
  if (action.type === "SET_LOGINEXPIRE") {
    return action.expirationId;
  }
  if (action.type === "RESET") return -1;
  return state;
};
