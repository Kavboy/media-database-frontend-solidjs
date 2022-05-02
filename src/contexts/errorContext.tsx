import { createContext, createSignal, useContext } from "solid-js";
import type { AlertError, User } from "../utils/interfaces.js";

const ErrorContext = createContext();

export function ErrorProvider(props) {
  const [error, setError] = createSignal<User>(
      props.error || {
        variant: "danger",
        show: false,
        content: "network-error",
      }
    ),
    store = [
      error,
      {
        hideError() {
          setError({
            ...error(),
            content: "network-error",
            show: false,
          });
        },
        setNetworkError() {
          setError({
            ...error(),
            show: true,
          });
        },
        setUnexpectedError() {
          setError({
            ...error(),
            content: "unexpected-error",
            show: true,
          });
        },
        set401Error() {
          setError({
            ...error(),
            content: "401-error",
            show: true,
          });
        },
        setTMDB401Error() {
          setError({
            ...error(),
            content: "tmdb-401-error",
            show: true,
          });
        },
        setTMDB404Error() {
          setError({
            ...error(),
            content: "tmdb-404-error",
            show: true,
          });
        },
      },
    ];

  return (
    <ErrorContext.Provider value={store}>
      {props.children}
    </ErrorContext.Provider>
  );
}

export function useError() {
  return useContext(ErrorContext);
}
