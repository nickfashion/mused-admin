import React, { Component } from 'react';
import { Row, Col, Button } from 'reactstrap';
import { cutString } from '../../../services'

const theme = require('../theme.css');

export default class PostItem extends Component {
    render() {
        const { post, editPost, deletePost } = this.props;
        const { title, postId } = post;

        return (
            <Row className={theme.itemWrapper}>
                <Col xs="6">
                    {title && <h4 className={theme.titleSize}>{cutString(title, 50)}</h4>}
                </Col>
                <Col xs="6" className={theme.buttonsGroup}>
                    <Button outline color="secondary"
                        onClick={() => editPost(postId)}>
                        Edit
                    </Button>
                    <Button outline color="secondary"
                        onClick={() => deletePost(postId)}>
                        Delete
                    </Button>
                </Col>
            </Row>
        )
    }

 }
