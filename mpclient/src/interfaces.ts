export interface IFilm {
    original_title: string;
    poster_path: string;
    release_date: string;
    original_language: string;
    id:number;
}

export interface IUser {
    id: number;
    username: string;
    email: string;
    password: string;
    isadmin: boolean;
    isbanned: boolean;
    regdate: string;
    profile_id:number;
    description:string;
    points:number;
}