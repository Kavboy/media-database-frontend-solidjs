import { Show, mergeProps } from "solid-js";
import { Link } from "solid-app-router";
import EmptyMedia from "./emptyMediaComponent";

export default function NoMedia(props) {
  const merged = mergeProps({ noLink: false }, props);

  const date = new Date().toLocaleDateString("DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const auth = {
    user: {
      role: "Admin",
    },
  };

  return (
    <>
      <Show
        when={
          auth?.user &&
          (auth?.user?.role === "Admin" || auth?.user?.role === "Creator")
        }
        fallback={<EmptyMedia noLink={merged.noLink} />}
      >
        <Link class="mdb-media-link" href="/add-media">
          <EmptyMedia />
        </Link>
      </Show>
    </>
  );
}
