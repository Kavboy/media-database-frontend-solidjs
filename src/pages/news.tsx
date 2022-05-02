import { Container, Spinner } from "solid-bootstrap";
import { createResource, For, Show } from "solid-js";
import MediaComponent from "../components/media/mediaComponent";
import { Media } from "../utils/interfaces";
import { getNews } from "../apis/AxiosLaravel";
import NoMedia from "../components/media/noMediaComponent";

export default function News() {
  const [mediaNews] = createResource(true, getNews);

  const title = "News";

  return (
    <Container>
      <h2 className="mdb-page-header mdb-card-style mt-3 p-2">{title}</h2>
      <Show when={mediaNews.loading}>
        <Spinner id="mdb-spinner" animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Show>
      <Show
        when={
          (!mediaNews.loading && mediaNews.error) ||
          (!mediaNews.loading && mediaNews().data.length == 0)
        }
      >
        <NoMedia />
        <NoMedia />
      </Show>
      <Show
        when={
          !mediaNews.loading && !mediaNews.error && mediaNews().data.length > 0
        }
      >
        <For
          each={
            //@ts-ignore server returns json object with data array
            mediaNews()?.data as Media[]
          }
        >
          {(media, i) => <MediaComponent media={media} />}
        </For>
      </Show>
    </Container>
  );
}
