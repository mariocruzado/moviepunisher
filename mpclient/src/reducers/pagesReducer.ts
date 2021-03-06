import { TAction } from '../actionTypes';
import { IPages } from '../interfaces';

const defaultPages:IPages = {
    current:1,
    total:1,
    sortMode:0,
    sortOrder:1,
    itemsPerPage:4
};
export const pagesReducer = (state: IPages = defaultPages, action: TAction) => {
    if (action.type === "SAVE_PAGES") return action.pageInfo;
    if (action.type === "RESET") return defaultPages;
    return state;
}