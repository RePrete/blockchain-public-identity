import { useState } from "react";
import { Button, Form, Container, Row, Col } from "react-bootstrap";

async function registerUserContract(firstName, lastName, email, user) {
    await user.contract.createUser(
        firstName,
        lastName,
        email,
        { from: user.defaultAccount }
    )
    window.location.reload()
}

function RegisterComponent({user}) {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')

    return (
        <Container>
            <Form>
                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Control type="text" placeholder="Firstname" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Control type="text" placeholder="Lastname" type="text" value={lastName} onChange={(event) => setLastName(event.target.value)} />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Control type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button variant="primary" onClick={async (event) => { event.preventDefault(); registerUserContract(firstName, lastName, email, user) }}>
                            Submit
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
}

export default RegisterComponent;