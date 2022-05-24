import { Navbar, Nav, Dropdown, Button } from "solid-bootstrap";
import { createSignal, Show } from "solid-js";
import { Link } from "solid-app-router";
import Fa from "solid-fa";
import { faKey, faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import LoginModal from "./loginModal";
import { useAuth } from "../contexts/authContext";

export default function Header() {
  const [loginShow, setLoginShow] = createSignal(false);
  // @ts-ignore
  const [user, { logout, check }] = useAuth();

  check();

  const logginFallback = (
    <>
      <Dropdown>
        <Dropdown.Toggle
          as={Nav.Link}
          className="nav-link no-button"
          aria-label="Toggle Dropdown"
        >
          <Fa icon={faUser} />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Nav.Item>
            <Link className="dropdown-item" href="/media-management">
              Media Management
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Button
              id="mdb-nav-button"
              aria-label="Logout"
              onClick={() => logout()}
            >
              <Fa icon={faSignOutAlt} />
            </Button>
          </Nav.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );

  return (
    <>
      <Navbar id="mdb-header" bg="primary" variant="dark" expand="md">
        <Link id="mdb-home" className="navbar-brand" href="/">
          MDb
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="mdb-header-nav-collapse">
          <Nav className="me-md-auto">
            <Nav.Item>
              <Link className="nav-link" href="/">
                News
              </Link>
            </Nav.Item>
          </Nav>
          <Nav className="me-3">
            <Show when={!user()} fallback={logginFallback}>
              <Nav.Item>
                <Nav.Link
                  id="mdb-nav-button"
                  onClick={(e) => {
                    e.preventDefault();
                    setLoginShow(true);
                  }}
                >
                  <Fa icon={faKey} />
                </Nav.Link>
              </Nav.Item>
            </Show>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <LoginModal show={loginShow()} onHide={() => setLoginShow(false)} />
    </>
  );
}
