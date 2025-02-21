import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Cookies from 'universal-cookie';

function Navigation() {
  const cookies = new Cookies();
  let auth = cookies.get('token', { path: '/' })
  let username = cookies.get('username', { path: '/' })
  let userid = cookies.get('userid', { path: '/' })

  return (
    <Navbar expand="lg" className="bg-body-tertiary" data-bs-theme="dark">
      <Container fluid>
        <Navbar.Brand href="/">Next Nest</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Cities</Nav.Link>
            <Nav.Link href="/tax">Taxes</Nav.Link>
            <Nav.Link href="/weather">Weather</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            {auth ? (<Nav.Link href={`/user/${userid}`}>{username}</Nav.Link>) : (<Nav.Link href="/login">Login</Nav.Link>)}
            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;