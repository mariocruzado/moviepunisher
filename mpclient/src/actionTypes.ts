import { IPages, IFilm } from "./interfaces";
type TSetToken = {
  type: "SET_TOKEN";
  newToken: string;
};
type TSetLoginExpire = {
  type: "SET_LOGINEXPIRE";
  expirationId: number;
};

type TSaveLastFilms = {
  type: "SAVE_LASTFILMS";
  storedFilms: any[];
};

type TReset = {
  type: "RESET";
};

type TSaveQuery = {
  type: "SAVE_QUERY";
  newQuery: string;
};

type TSaveFilmPages = {
  type: "SAVE_PAGES";
  pageInfo: IPages;
};

type TSaveFilm = {
  type: "SAVE_FILM";
  actualFilm: IFilm;
};

type TAddFilm = {
  type: "ADD_FILM";
  newFilm: IFilm;
};

type TDeleteFilm = {
  type: "DELETE_FILM";
  filmId: number;
};

export type TAction =
  | TDeleteFilm
  | TAddFilm
  | TSaveFilm
  | TSaveFilmPages
  | TSetToken
  | TSetLoginExpire
  | TSaveLastFilms
  | TReset
  | TSaveQuery;
