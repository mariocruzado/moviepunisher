import { combineReducers } from "redux";
import { tokenReducer } from "./tokenReducer";
import { loginExpireReducer } from './expirationReducer';
import { filmsReducer } from './filmsReducer';
import { queryReducer } from './queryReducer';
import { pagesReducer } from './pagesReducer';
import { IPages, IFilm } from '../interfaces';
import { actualFilmReducer } from './actualFilmReducer';

export interface IGlobalState {
    token: string;
    expirationId: number;
    storedFilms: any[];
    saveQuery: string;
    storedPages: IPages;
    actualFilm: IFilm;
}
export const reducers = combineReducers<IGlobalState>({
    token: tokenReducer,
    expirationId: loginExpireReducer,
    storedFilms: filmsReducer,
    saveQuery: queryReducer,
    storedPages: pagesReducer,
    actualFilm: actualFilmReducer
});