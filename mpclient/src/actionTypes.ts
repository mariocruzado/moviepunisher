type TSetToken = {
    type: 'SET_TOKEN';
    newToken: string;
}
type TSetLoginExpire = {
    type: 'SET_LOGINEXPIRE';
    expirationId: number;
}

type TSaveLastFilms = {
    type: 'SAVE_LASTFILMS';
    storedFilms:any[];
}

export type TAction = TSetToken | TSetLoginExpire | TSaveLastFilms;