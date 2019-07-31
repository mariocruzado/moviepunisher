import { TAction } from "../actionTypes";

export const filmsReducer = (state: any[] = [], action: TAction) => {
  if (action.type === "SAVE_LASTFILMS") return action.storedFilms;
  if (action.type ==="RESET") return [];
  return state;
};
