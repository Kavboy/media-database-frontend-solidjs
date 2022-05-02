import Joi from "joi";
import { Button, Form, Modal, Spinner } from "solid-bootstrap";
import { createEffect, createSignal, mergeProps, Show } from "solid-js";
import { User } from "src/utils/interfaces";
import { useAuth } from "../contexts/authContext";
import { useError } from "../contexts/errorContext";

export default function LoginModal(props) {
  const merged = mergeProps({ show: false, onHide: () => {} }, props);
  const [user, { login }] = useAuth();
  const [errorContext, { setNetworkError }] = useError();

  /**
   * Validation schema for the login data
   * @type {Joi.ObjectSchema<any>}
   */
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });

  let usernameRef: HTMLInputElement;

  const [disabled, setDisabled] = createSignal(false);
  const [loading, setLoading] = createSignal(false);
  const [formData, setFormData] = createSignal({ username: "", password: "" });
  const [validation, setValidation] = createSignal({
    username: null,
    password: null,
  });

  const resetValidation = () => {
    setValidation({ username: null, password: null });
  };

  const resetFormData = () => {
    setFormData({ username: "", password: "" });
  };

  /**
   * Handle input changes
   * @param e event object
   */
  const handleChange = (e) => {
    e.preventDefault();
    resetValidation();

    setFormData({ ...formData(), [e.target.name]: e.target.value });
  };

  const handleEnterKey = (e) => {
    if (e.charCode === 13) {
      handleLogin(e);
    }
  };

  /**
   * Method that has all necessary steps to send the login request
   * @param e event object
   */
  const handleLogin = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDisabled(true);

    const { error } = schema.validate(formData(), {
      abortEarly: false,
      errors: { label: "key" },
    });

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

    if (!error) {
      setLoading(true);
      login(formData().username, formData().password)
        .then((res) => {
          if (res) {
            resetFormData();
            setDisabled(false);
            setLoading(false);
            merged.onHide();
          }
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 401) {
              setValidation({ username: false, password: false });
              setDisabled(false);
              setLoading(false);
            } else {
              setNetworkError();
              resetFormData();
              setDisabled(false);
              setLoading(false);
              merged.onHide();
            }
          } else {
            setNetworkError();
            resetFormData();
            setDisabled(false);
            setLoading(false);
            merged.onHide();
          }
        });
    } else {
      setDisabled(false);
    }
  };

  return (
    <Modal
      show={merged.show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      backdrop="static"
      centered
      onEntering={() => usernameRef.focus()}
      onExiting={() => {
        resetValidation();
        resetFormData();
      }}
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Show when={loading()}>
          <Spinner
            id="mdb-modal-spinner"
            className="d-block me-auto ms-auto mb-5 mt-5"
            animation="border"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Show>
        <Show when={!loading()}>
          <Form id="mdb-login-form" noValidate>
            <Form.Group controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                ref={usernameRef}
                required
                type="text"
                name="username"
                onInput={handleChange}
                value={formData().username}
                disabled={disabled()}
                placeholder="Username"
                isInvalid={
                  validation().username !== null ? !validation().username : null
                }
                isValid={validation().username}
              />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Passwort</Form.Label>
              <Form.Control
                required
                type="password"
                name="password"
                onInput={handleChange}
                value={formData().password}
                disabled={disabled()}
                placeholder="Passwort"
                onKeyPress={handleEnterKey}
                isInvalid={
                  validation().password !== null ? !validation().password : null
                }
                isValid={validation().password}
              />
              <Form.Control.Feedback type="invalid">
                Username oder Passwort falsch
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Show>
      </Modal.Body>
      <Modal.Footer>
        <Show when={!loading()}>
          <Button type="submit" color="outline-primary" onClick={handleLogin}>
            Login
          </Button>
        </Show>
        <Button
          variant="outline-danger"
          onClick={() => {
            merged.onHide();
          }}
        >
          Abbrechen
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
