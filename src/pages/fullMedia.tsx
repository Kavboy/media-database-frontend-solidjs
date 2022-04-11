import { useParams } from "solid-app-router";
import { Container, Spinner } from "solid-bootstrap";
import { createResource, Show } from "solid-js";
import { getMedia } from "../apis/AxiosLaravel";
import { Media } from "../utils/interfaces";
import NoMedia from "../components/media/noMediaComponent";
import MediaComponent from "../components/media/mediaComponent";

export default function FullMedia() {
  const params = useParams();
  const [response] = createResource(params.id, getMedia);

  return (
    <Container>
      <Show when={response.loading}>
        <Spinner id="mdb-spinner" animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Show>
      <Show when={!response.loading && response.error}>
        <NoMedia />
        <NoMedia />
      </Show>
      <Show when={!response.loading && !response.error}>
        <h2 className="mdb-page-header mdb-card-style mt-3 p-2">
          {(response() as Media).title}
        </h2>
        <MediaComponent media={response()} full />
      </Show>
    </Container>
  );
}
