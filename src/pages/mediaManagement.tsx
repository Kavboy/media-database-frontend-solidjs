import { Container, Spinner, Table } from "solid-bootstrap";
import { createResource, For, Show } from "solid-js";
import { Media } from "../utils/interfaces";
import { getMediasTable } from "../apis/AxiosLaravel";
import { genreDisplay, getFSKClass, getPosterSRC } from "../utils/media";
import { Link } from "solid-app-router";
import Fa from "solid-fa";
import { faEye, faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../contexts/authContext";

export default function MediaManagement() {
  // @ts-ignore
  const [user, { requireAuth }] = useAuth();
  const authRoles = requireAuth(["Admin", "Creator"]);

  let page = 1;
  const [mediaTable] = createResource(page, getMediasTable);

  return (
    <>
      <Show when={!user() && !authRoles}>
        <Spinner id="mdb-spinner" animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Show>
      <Show when={user() && authRoles}>
        <Container id="mdb-media-table">
          <h2 className="mdb-page-header mdb-card-style mt-3 p-2">
            Medienverwaltung
          </h2>
          <Container className="mdb-media-table mdb-card-style mb-3">
            <Show when={mediaTable.loading}>
              <Spinner id="mdb-spinner" animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </Show>
            <Show when={!mediaTable.loading && !mediaTable.error}>
              <Table striped responsive>
                <thead className="text-center">
                  <tr>
                    <th>Id</th>
                    <th>Poster</th>
                    <th>Typ</th>
                    <th>FSK</th>
                    <th>Titel</th>
                    <th>Beschreibung</th>
                    <th>Medium</th>
                    <th>Seasons</th>
                    <th>Poster</th>
                    <th>Ansehen</th>
                  </tr>
                </thead>
                <tbody>
                  <For each={mediaTable()?.data}>
                    {(el, index) => (
                      <tr>
                        <td>{el.id}</td>
                        <td>
                          <img
                            className="mdb-table-poster"
                            src={getPosterSRC(
                              el.tmdb_id,
                              el.poster_path,
                              "w92"
                            )}
                            alt={el.title + " poster"}
                          />
                        </td>
                        <td>{el.type}</td>
                        <td>
                          <div
                            className={`mdb-fsk ${getFSKClass(el.age_rating)}`}
                          >
                            {el.age_rating}
                          </div>
                        </td>
                        <td className="mdb-table-title">{el.title}</td>
                        <td>
                          <div>{el.overview}</div>
                        </td>
                        <td>{genreDisplay(el.genres)}</td>
                        <td>{el.mediums.join(", ")}</td>
                        <td>{el.seasons?.join(", ")}</td>
                        <td className="mdb-table-display">
                          <Link href={`/media/${el.id}`}>
                            <Fa icon={faEye} />
                          </Link>
                        </td>
                      </tr>
                    )}
                  </For>
                  <tr>
                    <td
                      colSpan="12"
                      aria-controls="button"
                      className="mdb-table-add-new"
                    >
                      <Link href="/add-media">
                        <Fa icon={faPlusSquare} /> Neue Medien hinzufügen
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Show>
          </Container>
        </Container>
      </Show>
    </>
  );
}
