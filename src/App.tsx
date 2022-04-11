import { Component } from "solid-js";
import Header from "./components/header";
import { useRoutes, useLocation } from "solid-app-router";
import { Container } from "solid-bootstrap";
import "./styles/index.css";
import "./styles/App.css";

import { routes } from "./routes";

const App: Component = () => {
  const location = useLocation();
  const Route = useRoutes(routes);

  return (
    <>
      <Header />

      <Container id="mdb-route-container">
        <Route />
      </Container>
    </>
  );
};

export default App;
