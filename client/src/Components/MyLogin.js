import { useState } from 'react';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';

function LoginForm(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validateEmail(username)) {
            const credentials = { username, password };
            try { await props.login(credentials); } catch (err) { throw err; }
        }
    };

    return (<Container fluid className='pt-4 mt-4'>
        <Row className="justify-content-center">
            <Col sm='auto' >
                <h1>Login to Politecnico di Bugliano</h1></Col></Row>
        <Row className="justify-content-center">
            <Col sm='5' >
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId='username' className='pb-2'>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type='email' value={username} placeholder='your@email.com' onChange={ev => setUsername(ev.target.value)} required={true} />
                    </Form.Group>

                    <Form.Group controlId='password' className='pb-2'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type='password' value={password} placeholder='Password' onChange={ev => setPassword(ev.target.value)} required={true} minLength={6} />
                    </Form.Group>

                    <Button type="submit">Login</Button>
                </Form></Col></Row>
    </Container>
    )
};

export { LoginForm };