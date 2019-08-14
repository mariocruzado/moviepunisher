import { TAction } from "../actionTypes";
import { IFilm } from '../interfaces';

export const filmsReducer = (state: IFilm[] = [], action: TAction) => {
  if (action.type === "SAVE_LASTFILMS") return action.storedFilms;
  if (action.type === "RESET") return [];
  if (action.type === "ADD_FILM") {
    state.push(action.newFilm);
    return [...state];
  }
  if (action.type === "DELETE_FILM") {
    const fIndex = state.findIndex((f:IFilm) => f.id === action.filmId);
    if (fIndex !== -1) {
      state.splice(fIndex,1);
      return [...state];
    }
  }
  return state;
};
