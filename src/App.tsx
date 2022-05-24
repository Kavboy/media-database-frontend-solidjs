import { Component } from "solid-js";
import Header from "./components/header";
import { useRoutes, useLocation } from "solid-app-router";
import { Container } from "solid-bootstrap";
import "./styles/index.css";
import "./styles/App.css";

import { routes } from "./routes";
import { ErrorProvider } from "./contexts/errorContext";
import { AuthProvider } from "./contexts/authContext";
import Footer from "./components/Footer";

const App: Component = () => {
  const location = useLocation();
  const Routes = useRoutes(routes);

  return (
    <>
      <ErrorProvider>
        <AuthProvider>
          <Header />
          <Container id="mdb-route-container">
            <Routes />
          </Container>
          <Footer />
        </AuthProvider>
      </ErrorProvider>
    </>
  );
};

export default App;
