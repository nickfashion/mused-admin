import React, { Component } from 'react';
import { Row, Col, Button } from 'reactstrap';

const theme = require('../theme.css');

export default class PostItem extends Component {
    render() {
        const { post, editPost, deletePost } = this.props;
        const { authorName, authorProfilePhoto, _id } = post;

        return (
            <Row className={theme.itemWrapper}>
                <Col xs="2">
                    { authorProfilePhoto && <img src={authorProfilePhoto} width="50" height="50" /> }
                </Col>
                <Col xs="6">
                    <h4>{ authorName }</h4>
                </Col>
                <Col xs="4" className={theme.buttonsGroup}>
                    <Button outline color="secondary"
                        onClick={() => editPost(_id)}>
                        Edit
                    </Button>
                    <Button outline color="secondary"
                        onClick={() => deletePost(_id)}>
                        Delete
                    </Button>
                </Col>
            </Row>
        )
    }

 }
