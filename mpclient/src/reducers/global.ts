import { combineReducers } from "redux";
import { tokenReducer } from "./tokenReducer";
import { loginExpireReducer } from './expirationReducer';
import { filmsReducer } from './filmsReducer';

export interface IGlobalState {
    token: string;
    expirationId: number;
    storedFilms: any[];
}
export const reducers = combineReducers<any>({
    token: tokenReducer,
    expirationId: loginExpireReducer,
    storedFilms: filmsReducer
});