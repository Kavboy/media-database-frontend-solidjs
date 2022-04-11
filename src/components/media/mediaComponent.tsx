import { Link } from "solid-app-router";
import { mergeProps, Show } from "solid-js";
import { genreDisplay, getFSKClass, getPosterSRC } from "../../utils/media";

export default function MediaComponent(props) {
  const merged = mergeProps({ media: null, full: false }, props);
  const media = merged.media;

  const fskClass = getFSKClass(media?.age_rating);
  const imgSrc = getPosterSRC(media?.tmdb_id, media.poster_path);
  let youtubeLink: string;

  if (media.youtube_link) {
    youtubeLink =
      "https://www.youtube-nocookie.com/embed/" + media.youtube_link;
  }

  // Format date based on language
  const added = new Date(media.created_at).toLocaleDateString("DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const released = new Date(media.release_date).toLocaleDateString("DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <>
      <Show when={!merged.full}>
        <Link class="mdb-media-link" href={"/media/" + media.id}>
          <div class="d-flex mdb-media mdb-card-style mb-3 mt-3">
            <img
              class="flex-shrink-0 mdb-media-poster ms-md-3 me-md-3 ms-auto me-auto mt-3 mb-lg-3"
              src={imgSrc}
              alt={media.title + "Poster"}
            />
            <div class="flex-grow-1 p-3">
              <div class="d-flex flex-md-row flex-column justify-content-md-between">
                <div class="d-flex justify-content-md-start justify-content-center">
                  <p class={`mdb-fsk ${fskClass} me-3`}>{media.age_rating}</p>
                  <h4>{media.title}</h4>
                </div>
              </div>
              <p>Hinzugefügt: {added}</p>
              <p>{media.overview}</p>
            </div>
          </div>
        </Link>
      </Show>
      <Show when={merged.full}>
        <div class="mdb-media-full mdb-media mdb-card-style mdb-media-no-link mb-3 mt-3">
          <div class="mdb-media-full-head p-3">
            <img
              class="mdb-media-poster ms-md-3 me-md-3 ms-auto me-auto mb-3"
              src={imgSrc}
              alt={media.title + "Poster"}
            />
            <div class="mdb-media-info ms-3 w-100">
              <h6 class="d-inline">Typ:</h6>
              <p class="ms-1 d-inline">
                {media.type === "Movie" ? "Film" : "Serie"}
              </p>
              <p />
              <div class={`mdb-fsk mdb-full-fsk ${fskClass} me-lg-3`}>
                {media.age_rating}
              </div>
              <h6 class="d-inline">Hinzugefügt:</h6>
              <p class="ms-1 d-inline">{added}</p>
              <p />
              <h6 class="d-inline">Erschienen:</h6>
              <p class="ms-1 d-inline">{released}</p>
              <p />
              <h6 class="d-inline">Medium:</h6>
              <p class="ms-1 d-inline">{media.mediums.join(", ")}</p>
              <p />
              <h6 class="d-inline">Standort:</h6>
              <p class="ms-1 d-inline">{media.location}</p>
              <p />
              <h6 class="d-inline">Genre:</h6>
              <p class="ms-1 d-inline">{genreDisplay(media.genres)}</p>
              <p />
              <Show when={media.session}>
                <p />
                <h6 class="d-inline">Seasons:</h6>
                <p class="ms-1 d-inline">{media.seasons.join(", ")}</p>
                <p />
              </Show>
              <h6>Beschreibung:</h6>
              <p>{media.overview}</p>
            </div>
          </div>
          <Show when={media.youtube_link}>
            <hr class="mt-0" />
            <div class="container text-center">
              <h5>Trailer:</h5>
              <div class="mdb-youtube-video-container text-center">
                <iframe
                  width="560"
                  height="315"
                  src={youtubeLink}
                  title={media.title + " video player"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            </div>
          </Show>
        </div>
      </Show>
    </>
  );
}
