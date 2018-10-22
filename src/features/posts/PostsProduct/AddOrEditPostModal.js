import React, { Component } from 'react';
import { Row, Col, Button, Form, FormGroup, Label, Input, Alert, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { isNumber } from '../../../services/utils'

const theme = require('../theme.css');

const types = {
    edit: 'edit',
    add: 'add'
};

const title = {
    edit: 'Edit Post',
    add: 'Add New Post'
};

const submitText = {
    edit: 'Edit Post',
    add: 'Add Post'
};

export default class AddOrEditPostModal extends Component {
    type = types.add;

    state = {
        title: '',
        authorName: '',
        authorProfilePhotoURL: '',
        productId: '',
        errorMsg: null
    };

    componentDidUpdate(prevProps) {
        if (this.props.isOpen !== prevProps.isOpen && this.props.isOpen === true) {
            const { postId, getPostData } = this.props;

            if (postId) {
                const postData = getPostData(postId);

                this.type = types.edit;
                this.setState({
                    title: postData.title || '',
                    authorName: postData.authorName || '',
                    authorProfilePhotoURL: postData.authorProfilePhoto || '',
                    productId: postData.productId || ''
                })
            } else {
                this.type = types.add;
                this.clearForm();
            }
        }
    }

    savePost = () => {
        const { onClose, setPostData, addNewPost, postId } = this.props;
        const post = {
            title: this.state.title,
            authorName: this.state.authorName,
            authorProfilePhoto: this.state.authorProfilePhotoURL,
            productId: Number(this.state.productId),
            postType: 'product'
        };

        this.type === types.edit ? setPostData({postId, ...post}) : addNewPost(post);
        onClose()
    };

    render() {
        const { isOpen, onClose } = this.props;
        const type = this.type;

        return (
            <Modal isOpen={isOpen} >
                <ModalHeader>{ title[type] }</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col xs="12">
                            <Form>
                                <FormGroup>
                                    <Label for="title">Title</Label>
                                    <Input
                                        value={this.state.title}
                                        onChange={this.handleTitle}
                                        id="title"
                                        type="text" />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="authorName">Author Name</Label>
                                    <Input
                                        value={this.state.authorName}
                                        onChange={this.handleAuthorNameChange}
                                        id="authorName"
                                        type="text" />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="authorProfile">Author Profile Image URL</Label>
                                    <Input
                                        value={this.state.authorProfilePhotoURL}
                                        onChange={this.handleAuthorProfilePhoto}
                                        id="authorProfile"
                                        type="text" />
                                </FormGroup>
                                <FormGroup>
                                    <Label for={'productId'}>Product Id</Label>
                                    <Input
                                        value={this.state.productId}
                                        onChange={(event) => this.handleProductId(event.target.value)}
                                        id={'productId'}
                                        type="text" />
                                </FormGroup>
                                { this.state.errorMsg && <Alert color="danger">
                                    { this.state.errorMsg }
                                </Alert> }
                            </Form>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button outline color="primary" onClick={this.savePost}>{ submitText[type] }</Button>{' '}
                    <Button outline color="secondary" onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </Modal>
        )
    }


    clearForm = () => this.setState({
        title: '',
        authorName: '',
        authorProfilePhotoURL: '',
        productId: ''
    });

    handleAuthorNameChange = (event) => this.setState({authorName: event.target.value});
    handleAuthorProfilePhoto = (event) => this.setState({authorProfilePhotoURL: event.target.value});
    handleTitle = (event) => this.setState({title: event.target.value});

    handleProductId = (value) => {
        (isNumber(value) || value === '') &&
            this.setState({productId: value});
    };

}
