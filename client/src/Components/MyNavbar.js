import '../App.css';
import { Container, Navbar, Nav, Modal, Button, Col, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function MyNavbar(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const navigate = useNavigate();


    return (<>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Hi, {props.user.name} {props.user.surname}</Modal.Title>
            </Modal.Header>
            <Modal.Body><strong>Email:</strong> {props.user.username}</Modal.Body>
            <Modal.Body><strong>ID:</strong> {props.user.id}</Modal.Body>
            <Modal.Body><strong>Study plan:</strong> {props.user.fullTime === null ? 'None' : (props.user.fullTime === 1 ? 'Full-time' : 'Part-time')}</Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleClose}>
                    Close
                </Button>
                <Row>
                    <Col onClick={handleClose} >
                        <Button variant="outline-primary" onClick={props.logout}>Logout</Button>
                    </Col>
                </Row>
            </Modal.Footer>
        </Modal>

        <Navbar bg='primary' className='shadow' expand='lg' >
            <Container fluid>
                <Link to='/'><Navbar.Brand className='text-light'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-mortarboard me-2" viewBox="0 0 16 16">
                        <path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917l-7.5-3.5ZM8 8.46 1.758 5.965 8 3.052l6.242 2.913L8 8.46Z" />
                        <path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466 4.176 9.032Zm-.068 1.873.22-.748 3.496 1.311a.5.5 0 0 0 .352 0l3.496-1.311.22.748L8 12.46l-3.892-1.556Z" />
                    </svg>
                    Politecnico di Bugliano
                </Navbar.Brand></Link>
                {props.loggedIn ? < Nav.Link onClick={handleShow} className='text-light pe-4'>{props.user.name + ' ' + props.user.surname + '  '}<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                    <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                </svg></Nav.Link> : <Nav.Link onClick={() => { navigate('/login') }} className='text-light pe-4'><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                    <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                </svg></Nav.Link>}
            </Container>
        </Navbar>
    </>
    );
}

export { MyNavbar };