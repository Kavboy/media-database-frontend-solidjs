import { Button, Modal } from "solid-bootstrap";
import { mergeProps } from "solid-js";

export default function LoginModal(props) {
  const merged = mergeProps({ show: false, onHide: () => {} }, props);
  const auth = false;

  return (
    <Modal
      show={merged.show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      backdrop="static"
      centered
      onExiting={() => {}}
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">Login</Modal.Title>
      </Modal.Header>
      <Modal.Body />
      <Modal.Footer>
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
