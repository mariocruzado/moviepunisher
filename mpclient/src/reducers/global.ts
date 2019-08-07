import { combineReducers } from "redux";
import { tokenReducer } from "./tokenReducer";
import { loginExpireReducer } from './expirationReducer';
import { filmsReducer } from './filmsReducer';
import { queryReducer } from './queryReducer';
import { pagesReducer } from './pagesReducer';
import { IPages } from '../interfaces';

export interface IGlobalState {
    token: string;
    expirationId: number;
    storedFilms: any[];
    saveQuery: string;
    storedPages: IPages;
}
export const reducers = combineReducers<IGlobalState>({
    token: tokenReducer,
    expirationId: loginExpireReducer,
    storedFilms: filmsReducer,
    saveQuery: queryReducer,
    storedPages: pagesReducer
});