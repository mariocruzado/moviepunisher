import { TAction } from '../actionTypes';

const defaultQuery = '';
export const queryReducer = (state:string = defaultQuery, action:TAction) => {
    if (action.type === "SAVE_QUERY") return action.newQuery;
    if (action.type ==="RESET") return '';
    return state;
}