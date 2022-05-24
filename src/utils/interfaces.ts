import { Color } from "solid-bootstrap"

interface Media {
    id: string,
    type: string,
    title: string,
    overview: string,
    age_rating: string,
    tmdb_id: string,
    poster_path: string,
    mediums: Array<string>,
    seasons: Array<string>|null,
    location: string|null,
    genres: Array<string>,
    youtube_link: string,
    release_date: string,
    created_at: string,
    updated_at: string
}
interface MediaPages {
    current_page: number,
    data: Media[],
    first_page_url: URL,
    from: URL|null,
    last_page: number,
    last_page_url: URL,
    links:[
        {
            url: URL|null,
            label: string,
            active: boolean
        }    
    ],
    next_page_url: URL|null,
    path: URL,
    per_page: number,
    prev_page_url: URL|null,
    to: URL|null,
    total: number
}
interface seenMedia {
    id: number
}

interface User {
    username: string,
    role: string,
    seen_media: seenMedia
}

interface AlertError { 
    variant: Color, 
    show: boolean, 
    content: string 
}

export type {
    Media,
    MediaPages,
    User,
    AlertError
}