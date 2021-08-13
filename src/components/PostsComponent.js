import { useState } from "react";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import { Image } from "./";
import logo from "../ethereumLogo.png";

async function createNewPost(content, user) {
    const now = Math.round((new Date()).getTime() / 1000);
    await user.contract.createPost(content, now, { from: user.defaultAccount })
    window.location.reload()
}


function PostList({ user }) {
    return (
        <ul>
            {user && user.postList ? user.postList.map((item, index) => { return <li key={index}>{item.content + ' ' + item.timestamp.toISOString()}</li> }) : ''}
        </ul>
    );
}

function PostsComponent({user}) {
    const [postContent, setPostContent] = useState('')

    return (
        <Container>
            <Row>
                <Col>
                    <Image src={logo} alt="react-logo" />
                    <PostList user={user} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Control type="textarea" placeholder="Post" value={postContent} onChange={(event) => setPostContent(event.target.value)} />
                            <Button onClick={async () => { createNewPost(postContent, user) }}>Save</Button>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default PostsComponent;