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
    User,
    AlertError
}