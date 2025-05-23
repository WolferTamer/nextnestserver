import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Cookies from 'universal-cookie';

function Navigation() {
  const cookies = new Cookies();
  let [auth, setAuth] = useState(null)
  let [username, setUsername] = useState(null)
  let [userid, setUserid] = useState(null)
  console.log(auth)
  useEffect(() => {
    console.log("updating NavBar")
    setAuth(localStorage.getItem('token'))
    setUsername(localStorage.getItem('username'))
    setUserid(localStorage.getItem('userid'))
  }, [])

  useEffect(() => {
    function checkUserData() {
        setAuth(localStorage.getItem('token'))
      setUsername(localStorage.getItem('username'))
      setUserid(localStorage.getItem('userid'))
    }
  
    window.addEventListener('storage', checkUserData)
  
    return () => {
      window.removeEventListener('storage', checkUserData)
    }
  }, [])

  return (
    <Navbar expand="lg" className="bg-body-tertiary navbar-default"> 
      <Container fluid>
        <Navbar.Brand href="/">Next Nest</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Cities</Nav.Link>
            <Nav.Link href="/quiz">Quiz</Nav.Link>
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