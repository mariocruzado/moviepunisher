import { TAction } from "../actionTypes";

export const actualFilmReducer = (state: any = [], action: TAction) => {
  if (action.type === "SAVE_FILM") return action.actualFilm;
  if (action.type === "RESET") return [];
  return state;
};
