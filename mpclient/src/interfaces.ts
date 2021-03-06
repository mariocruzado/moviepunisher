export interface IFilm {
    original_title: string;
    poster_path: string;
    release_date: string;
    original_language: string;
    backdrop_path:string;
    average:number;
    nReviews:number;
    id:number;
    overview:string;
    genres:[];
    tagline:string;
    title:string;
    spoken_languages:[];
    runtime:number;
}

export interface IUser {
    id: number;
    username: string;
    email: string;
    password: string;
    isadmin: boolean | number;
    isbanned: boolean | number;
    regdate: string;
    profile_id:number;
    description:string;
    points:number;
    reviews:number;
    profile_avatar:string;
    profile_name:string;
}

export interface IPages {
    current: number;
    total: number;
    sortMode:number;
    sortOrder:number;
    itemsPerPage:number;
}