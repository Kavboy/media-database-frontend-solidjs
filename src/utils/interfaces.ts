export interface Media {
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