import { ActionCreator } from 'redux';
import { TAction } from './actionTypes';


export const setToken: ActionCreator<TAction> = (newToken: string) => ({
    type:'SET_TOKEN',
    newToken
})

export const setLoginExpiration: ActionCreator<TAction> = (expirationId: number) => ({
    type:'SET_LOGINEXPIRE',
    expirationId
});

export const saveLastFilms: ActionCreator<TAction> = (storedFilms:any[]) => ({
    type:'SAVE_LASTFILMS',
    storedFilms
});

export const saveQuery: ActionCreator<TAction> = (newQuery:string) => ({
    type:'SAVE_QUERY',
    newQuery
});
export const reset: ActionCreator<TAction> = () => ({
    type: 'RESET'
});