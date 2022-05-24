import { faCopyright } from "@fortawesome/free-solid-svg-icons";
import { Container } from "solid-bootstrap";
import Fa from "solid-fa";

/**
 * Component that represents the footer of the site
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const Footer = (props) => {
  return (
    <Container id="mdb-footer" fluid>
      <p className="mdb-copy-right pt-1">
        Kevin Kasprus Studienprojekt <Fa icon={faCopyright} /> 2022
      </p>
    </Container>
  );
};

export default Footer;
