import { IPages } from './interfaces';
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

export type TAction =
  | TSaveFilmPages
  | TSetToken
  | TSetLoginExpire
  | TSaveLastFilms
  | TReset
  | TSaveQuery;
