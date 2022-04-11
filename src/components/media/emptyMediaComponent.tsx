import { Show, mergeProps } from "solid-js";

export default function EmptyMedia(props) {
  const merged = mergeProps({ noLink: false, full: false }, props);

  const date = new Date().toLocaleDateString("DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div
      className="d-flex mdb-empty-media mdb-card-style  mb-3 mt-3"
      classList={{
        "mdb-media-no-link": merged.noLink,
        "mdb-media-full": merged.full,
        "mdb-media": !merged.full,
      }}
    >
      <div className="flex-shrink-0 mdb-media-poster mdb-no-media-poster ms-md-3 me-md-3 ms-auto me-auto mt-3 mb-lg-3" />
      <div className="flex-grow-1 m-3">
        <div className="d-flex justify-content-md-start justify-content-center">
          <p className={`mdb-fsk me-3`}>0</p>
          <h4>Keine Medien gefunden!</h4>
        </div>

        <p>Hinzugefügt: {date}</p>

        <Show when={!merged.noLink}>
          <p>Klicke hier um neue Medien hinzuzufügen!</p>
        </Show>

        <p className="mdb-no-media-text" />
        <p className="mdb-no-media-text" />
        <p className="mdb-no-media-text" />
      </div>
    </div>
  );
}
