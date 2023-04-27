import { Navbar, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faUser,
  faEdit,
  faPowerOff,
} from '@fortawesome/free-solid-svg-icons';

export default function NavigationPanel(props) {
  return (
    <Navbar expand="lg">
      <Navbar.Toggle />
      <Navbar.Collapse id="navbar">
        <Nav className="navigation">
          {props.isConnected ? (
            <>
              <Nav.Link
                href="#"
                onClick={() => props.setCurrentPage('home_page')}
              >
                <FontAwesomeIcon icon={faHome} /> Accueil
              </Nav.Link>
              <Nav.Link
                href="#"
                onClick={() => props.setCurrentPage(props.myLogin)}
              >
                <FontAwesomeIcon icon={faUser} /> Profil
              </Nav.Link>
              <Nav.Link
                href="#"
                onClick={() => props.setCurrentPage('edit_page')}
              >
                <FontAwesomeIcon icon={faEdit} /> Editer profil
              </Nav.Link>
              <Nav.Link href="#" onClick={props.setLogout}>
                <FontAwesomeIcon icon={faPowerOff} /> Déconnexion
              </Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link
                href="#"
                onClick={() => props.setCurrentPage('signin_page')}
              >
                Inscription
              </Nav.Link>
              <Nav.Link
                href="#"
                onClick={() => props.setCurrentPage('login_page')}
              >
                Connexion
              </Nav.Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
