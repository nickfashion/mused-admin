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

const getProductIds = (productIds) => {
    if (!productIds.length) return '';
    return productIds.join('\n');
};

export default class AddOrEditPostModal extends Component {
    type = types.add;

    state = {
        authorName: '',
        authorProfilePhotoURL: '',
        inspirationalImageURL: '',
        title: '',
        productIds: '',
        errorMsg: null
    };

    componentDidUpdate(prevProps) {
        if (this.props.isOpen !== prevProps.isOpen && this.props.isOpen === true) {
            const { postId, getPostData } = this.props;

            if (postId) {
                const postData = getPostData(postId);

                this.type = types.edit;
                const productIds = getProductIds(postData.productIds);
                this.setState({
                    title: postData.title || '',
                    authorName: postData.authorName,
                    authorProfilePhotoURL: postData.authorProfilePhoto || '',
                    inspirationalImageURL: postData.inspirationalImage || '',
                    productIds
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
            inspirationalImage: this.state.inspirationalImageURL,
            productIds: this.setProductIds(this.state.productIds),
            postType: 'list'
        };

        this.type === types.edit ? setPostData({postId, ...post}) : addNewPost(post);
        onClose()
    };

    setProductIds = (productIds) => {
        return productIds ?
            productIds.split('\n').filter(Boolean).map(id => +id) :
            []
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
                                    <Label for="inspirationalImage">Inspirational Image URL</Label>
                                    <Input
                                        value={this.state.inspirationalImageURL}
                                        onChange={this.handleInspirationalImage}
                                        id="inspirationalImage"
                                        type="text" />
                                </FormGroup>
                                <Row>
                                    { this.renderSlots() }
                                </Row>
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

    renderSlots = () =>
            (
                <Col style={{maxWidth: '20%'}}>
                    <FormGroup>
                        <Label for={'productIds'}>Product Ids</Label>
                        <Input
                            value={this.state.productIds}
                            onChange={(event) => this.handleProductIds(event.target.value)}
                            id={'productIds'}
                            type="textarea"
                            rows="8" />
                    </FormGroup>
                </Col>
            );

    clearForm = () => this.setState({
        title: '',
        authorName: '',
        authorProfilePhotoURL: '',
        inspirationalImageURL: '',
        productIds: ''
    });

    handleAuthorNameChange = (event) => this.setState({authorName: event.target.value});
    handleAuthorProfilePhoto = (event) => this.setState({authorProfilePhotoURL: event.target.value});
    handleInspirationalImage = (event) => this.setState({inspirationalImageURL: event.target.value});
    handleTitle = (event) => this.setState({title: event.target.value});

    handleProductIds = (value) => {
        (isNumber(value.replace(/\n/g,'')) || value === '') &&
            this.setState({productIds: value});
    };

}
