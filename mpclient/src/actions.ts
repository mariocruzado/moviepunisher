import { ActionCreator } from "redux";
import { TAction } from "./actionTypes";
import { IPages, IFilm } from "./interfaces";

export const setToken: ActionCreator<TAction> = (newToken: string) => ({
  type: "SET_TOKEN",
  newToken
});

export const setLoginExpiration: ActionCreator<TAction> = (
  expirationId: number
) => ({
  type: "SET_LOGINEXPIRE",
  expirationId
});

export const saveLastFilms: ActionCreator<TAction> = (storedFilms: any[]) => ({
  type: "SAVE_LASTFILMS",
  storedFilms
});

export const saveQuery: ActionCreator<TAction> = (newQuery: string) => ({
  type: "SAVE_QUERY",
  newQuery
});

export const reset: ActionCreator<TAction> = () => ({
  type: "RESET"
});

export const savePages: ActionCreator<TAction> = (pageInfo: IPages) => ({
  type: "SAVE_PAGES",
  pageInfo
});

export const saveFilm: ActionCreator<TAction> = (actualFilm: IFilm) => ({
  type: "SAVE_FILM",
  actualFilm
});

export const addFilm: ActionCreator<TAction> = (newFilm: IFilm) => ({
  type: "ADD_FILM",
  newFilm
});

export const deleteFilm: ActionCreator<TAction> = (filmId: number) => ({
  type: "DELETE_FILM",
  filmId
})
