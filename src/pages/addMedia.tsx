import { Button, Container, Form, Spinner } from "solid-bootstrap";
import { batch, createResource, createSignal, For, Show } from "solid-js";
import { useAuth } from "../contexts/authContext";
import {
  getFSK,
  getGenre,
  getLocations,
  getMediums,
  addMedia,
} from "../apis/AxiosLaravel";
import { useError } from "../contexts/errorContext";
import {
  getKeyFromYoutubeLink,
  handleCheckBoxes,
  validateData,
} from "../utils/addUpdateMedia";
import { genresGerman } from "../utils/media";

export default function AddMedia() {
  // @ts-ignore
  const [user, { requireAuth }] = useAuth();
  const authRoles = requireAuth(["Admin", "Creator"]);
  // @ts-ignore
  const [error, { setNetworkError, setUnexpectedError }] = useError();
  const [laravelMediums] = createResource(true, getMediums);
  const [laravelFSK] = createResource(true, getFSK);
  const [laravelGenre] = createResource(true, getGenre);

  let file = null;

  const [fileValidation, setFileValidation] = createSignal(null);
  const [disabled, setDisabled] = createSignal(false);

  const [validation, setValidation] = createSignal({
    type: null,
    title: null,
    release_date: null,
    overview: null,
    youtube_link: null,
    age_rating: null,
    location: null,
    mediums: null,
    genres: null,
    cast: null,
    seasons: null,
  });

  const [data, setData] = createSignal({
    type: "",
    title: "",
    release_date: "",
    overview: "",
    youtube_link: "",
    age_rating: "0",
    location: "",
    mediums: [],
    genres: [],
    cast: [],
    seasons: [],
  });

  const resetValidation = () => {
    batch(() => {
      setFileValidation(null);
      setValidation({
        type: null,
        title: null,
        release_date: null,
        overview: null,
        youtube_link: null,
        age_rating: null,
        location: null,
        mediums: null,
        genres: null,
        cast: null,
        seasons: null,
      });
    });
  };

  const handleChange = (e: Event) => {
    batch(() => {
      resetValidation();
      setData({
        ...data(),
        [(e.target as HTMLInputElement).name]: (e.target as HTMLInputElement)
          .value,
      });
    });
  };

  const handleFile = (e: Event) => {
    resetValidation();
    const input = e.target as HTMLInputElement;
    file = input.files[0];
  };

  const handleCheckbox = (e: Event) => {
    batch(() => {
      resetValidation();
      handleCheckBoxes(
        (e.target as HTMLInputElement).name,
        (e.target as HTMLInputElement).value,
        data(),
        setData
      );
    });
  };

  const handleSeasons = (seasons) => {
    setData({
      ...data(),
      seasons,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDisabled(true);

    const error = validateData(data());

    const temp = {};
    Object.keys(validation()).forEach((key) => {
      const toTest = error?.details?.find((err) => err.path.includes(key));
      temp[key] = !toTest;
    });

    if (temp) {
      setValidation({
        ...validation(),
        ...temp,
      });
    }

    if (!file) {
      setFileValidation(false);
    } else {
      setFileValidation(true);
    }

    if (!error && file) {
      const fd = new FormData();

      setData({
        ...data(),
        youtube_link: getKeyFromYoutubeLink(data().youtube_link),
      });

      // Workaround to set the youtube link, because setData isn´t executed properly
      data().youtube_link = getKeyFromYoutubeLink(data().youtube_link);

      Object.keys(data()).forEach((el) => {
        if (el === "mediums" || el === "genres" || el === "seasons") {
          data()[el]?.forEach((arr) => {
            fd.append(el + "[]", arr);
          });
        } else if (el === "cast") {
          data()[el]?.forEach((arr) => {
            fd.append(el + "[]", JSON.stringify(arr));
          });
        } else {
          fd.append(el, data()[el]);
        }
      });

      fd.append("poster_file", file);

      fd.append("_method", "put");

      try {
        addMedia(fd);
      } catch (error) {
        resetValidation();
        setDisabled(false);

        if (!error.response) {
          setNetworkError();
        } else {
          setUnexpectedError();
          console.log("ManualAdd");
          console.log(error);
        }
      }
    } else {
      setDisabled(false);
    }
  };

  return (
    <>
      <Show when={!user && !authRoles}>
        <Spinner id="mdb-spinner" animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Show>
      <Show when={user && authRoles}>
        <Container id="mdb-add-media">
          <h2 class="mdb-page-header mdb-card-style mt-3 p-2">
            Medien hinzufügen
          </h2>
          <Show
            when={
              laravelMediums.loading &&
              laravelFSK.loading &&
              laravelGenre.loading
            }
          >
            <Spinner id="mdb-spinner" animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </Show>
          <Show
            when={
              !laravelMediums.loading &&
              !laravelFSK.loading &&
              !laravelGenre.loading
            }
          >
            <Container className="mdb-add-media-form mdb-card-style">
              <Form
                id="mdb-create-form"
                class="p-3"
                novalidate
                onSubmit={handleSubmit}
              >
                <Form.Group id="mdb-create-form.formMediaType">
                  <Form.Label>Typ der Medie</Form.Label>
                  <Form.Select
                    name="type"
                    value={data().type}
                    onChange={handleChange}
                    disabled={disabled()}
                    isInvalid={
                      validation().type !== null ? !validation().type : null
                    }
                    isValid={validation().type}
                  >
                    <option />
                    <option value="Movie">Film</option>
                    <option value="TV">Serie</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Ein Typ muss angegeben werden
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group id="mdb-create-form.formTitle">
                  <Form.Label>
                    {data().type === "TV"
                      ? "Serien Titel"
                      : data().type === "Movie"
                      ? "Film Titel"
                      : "Media Titel"}
                  </Form.Label>
                  <Form.Control
                    name="title"
                    value={data().title}
                    onChange={handleChange}
                    type="text"
                    disabled={disabled()}
                    isInvalid={
                      validation().title !== null ? !validation().title : null
                    }
                    isValid={validation().title}
                  />
                  <Form.Control.Feedback type="invalid">
                    Ein Titel sollte angegeben werden
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group id="mdb-create-form.formOverview">
                  <Form.Label>
                    {data().type === "TV"
                      ? "Serien Beschreibung"
                      : data().type === "Movie"
                      ? "Film Beschreibung"
                      : "Media Beschreibung"}
                  </Form.Label>
                  <Form.Control
                    name="overview"
                    value={data().overview}
                    onChange={handleChange}
                    as="textarea"
                    rows={3}
                    disabled={disabled()}
                    isInvalid={
                      validation().overview !== null
                        ? !validation().overview
                        : null
                    }
                    isValid={validation().overview}
                  />
                </Form.Group>

                <Form.Group id="mdb-create-form.formFsk">
                  <Form.Label>
                    {data().type === "TV"
                      ? "Serien FSK"
                      : data().type === "Movie"
                      ? "Film FSK"
                      : "Media FSK"}
                  </Form.Label>
                  <Form.Select
                    required
                    name="age_rating"
                    value={data().age_rating}
                    onChange={handleChange}
                    disabled={disabled()}
                    isInvalid={
                      validation().age_rating !== null
                        ? !validation().age_rating
                        : null
                    }
                    isValid={validation().age_rating}
                  >
                    <option value="" />
                    <For each={laravelFSK()}>
                      {(fsk) => <option value={fsk}>{fsk}</option>}
                    </For>
                  </Form.Select>
                </Form.Group>

                <Form.Group id="mdb-create-form.formReleaseDate">
                  <Form.Label>
                    {data().type === "TV"
                      ? "Serien Erscheinungsdatum"
                      : data().type === "Movie"
                      ? "Film Erscheinungsdatum"
                      : "Media Erscheinungsdatum"}
                  </Form.Label>
                  <Form.Control
                    required
                    name="release_date"
                    value={data().release_date}
                    onChange={handleChange}
                    type="date"
                    disabled={disabled()}
                    isInvalid={
                      validation().release_date !== null
                        ? !validation().release_date
                        : null
                    }
                    isValid={validation().release_date}
                  />
                  <Form.Control.Feedback type="invalid">
                    Bitte ein Erscheinungsdatum eingeben
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group id="mdb-create-form.formReleaseDate">
                  <Form.Label>
                    {data().type === "TV"
                      ? "Serien Poster"
                      : data().type === "Movie"
                      ? "Film Poster"
                      : "Media Poster"}
                  </Form.Label>

                  <div class="d-flex">
                    <Form.Control
                      type="file"
                      name="poster"
                      id="mdb-add-media-file"
                      disabled={disabled()}
                      isValid={fileValidation()}
                      isInvalid={
                        fileValidation() !== null ? !fileValidation() : null
                      }
                      onChange={handleFile}
                    />
                  </div>
                </Form.Group>

                <Form.Group id="mdb-create-form.formYoutubeLink">
                  <Form.Label>
                    {data().type === "TV"
                      ? "Serien Youtube Trailer Link"
                      : data().type === "Movie"
                      ? "Film Youtube Trailer Link"
                      : "Media Youtube Trailer Link"}
                  </Form.Label>
                  <Form.Text>
                    <a
                      class="mdb-youtube-link-label"
                      href={
                        data().title
                          ? `https://www.youtube.com/results?search_query=${
                              data().title
                            }`
                          : "https://www.youtube.com"
                      }
                      rel="noreferrer"
                      target="_blank"
                    >
                      Suche hier
                    </a>
                  </Form.Text>
                  <Form.Control
                    name="youtube_link"
                    value={data().youtube_link}
                    onChange={handleChange}
                    type="url"
                    disabled={disabled()}
                    isInvalid={
                      validation().youtube_link !== null
                        ? !validation().youtube_link
                        : null
                    }
                    isValid={validation().youtube_link}
                  />
                  <Form.Control.Feedback type="invalid">
                    Es muss ein Youtube link in folgendem Format sein:
                    https://www.youtube.com/watch?v=jMkaCEP-l4g
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group id="mdb-create-form.formMediums" class="mb-3">
                  <Form.Label>Wähle ein Medium</Form.Label>
                  <div>
                    <For each={laravelMediums()}>
                      {(medium) => (
                        <Form.Check
                          label={medium}
                          name="mediums"
                          onChange={handleCheckbox}
                          type="checkbox"
                          value={medium}
                          inline
                          id={`inline-checkbox-${medium.toLowerCase()}`}
                          disabled={disabled()}
                          isInvalid={
                            validation().mediums !== null
                              ? !validation().mediums
                              : null
                          }
                          isValid={validation().mediums}
                        />
                      )}
                    </For>
                  </div>
                  <Form.Control.Feedback type="invalid">
                    Mindestens eines muss ausgewählt werden
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group id="mdb-create-form.formGenres" class="mb-3">
                  <Form.Label>Wähle ein Genre</Form.Label>
                  <div class="mb-3">
                    <For each={laravelGenre()}>
                      {(genre) => (
                        <Form.Check
                          label={genresGerman[genre]}
                          name="genres"
                          onChange={handleCheckbox}
                          type="checkbox"
                          value={genre}
                          inline
                          id={`inline-checkbox-${genre}`}
                          disabled={disabled()}
                          isInvalid={
                            validation().genres !== null
                              ? !validation().genres
                              : null
                          }
                          isValid={validation().genres}
                        />
                      )}
                    </For>
                  </div>
                  <Form.Control.Feedback type="invalid">
                    Mindestens eines muss ausgewählt werden
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  class="mdb-add-media-form-submit mt-3"
                  color="primary"
                  type="submit"
                  disabled={disabled()}
                >
                  {data().type === "TV"
                    ? "Serie hinzufügen"
                    : data().type === "Movie"
                    ? "Film hinzufügen"
                    : "Media hinzufügen"}
                </Button>
              </Form>
            </Container>
          </Show>
        </Container>
      </Show>
    </>
  );
}
