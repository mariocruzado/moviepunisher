import { combineReducers } from "redux";
import { tokenReducer } from "./tokenReducer";
import { loginExpireReducer } from './expirationReducer';
import { filmsReducer } from './filmsReducer';
import { queryReducer } from './queryReducer';

export interface IGlobalState {
    token: string;
    expirationId: number;
    storedFilms: any[];
    saveQuery: string;
}
export const reducers = combineReducers<any>({
    token: tokenReducer,
    expirationId: loginExpireReducer,
    storedFilms: filmsReducer,
    saveQuery: queryReducer
});