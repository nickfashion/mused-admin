import React, { Component } from 'react';
import { Row, Col, Button, Form, FormGroup, Label, Input, Alert, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { isNumber, dateMinusHours } from '../../../services/utils'

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
        title: '',
        productIds: '',
        date: ''
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
                    date: postData.date || '',
                    productIds
                })
            } else {
                this.type = types.add;
            }
        }
    }

    savePost = () => {
        const { setPostData, addNewPost, postId } = this.props;
        const { title, date } = this.state;
        const post = {
            title,
            productIds: this.setProductIds(this.state.productIds),
            date: this.type === types.add ? new Date() : date
        };
        this.type === types.edit ? setPostData({ postId, ...post }) : addNewPost(post);
        this.onCloseForm();

    };

    setProductIds = (productIds) => {
        return productIds ?
            productIds.split('\n').filter(Boolean).map(id => +id) :
            []
    };

    render() {
        const { isOpen } = this.props;
        const type = this.type;

        return (
            <Modal isOpen={isOpen} >
                <ModalHeader>{title[type]}</ModalHeader>
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
                                <Row>
                                    {this.renderSlots()}
                                </Row>
                                {this.state.errorMsg && <Alert color="danger">
                                    {this.state.errorMsg}
                                </Alert>}
                            </Form>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button outline color="primary" onClick={this.savePost}>{submitText[type]}</Button>{' '}
                    <Button outline color="secondary" onClick={this.onCloseForm}>Cancel</Button>
                </ModalFooter>
            </Modal>
        )
    }

    renderSlots = () =>
        (
            <Col style={{ maxWidth: '20%' }}>
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
        productIds: '',
        date: ''
    });

    handleTitle = (event) => this.setState({ title: event.target.value });

    handleProductIds = (value) => {
        (isNumber(value.replace(/\n/g, '')) || value === '') &&
            this.setState({ productIds: value });
    };
    onCloseForm = () => {
        this.props.onClose();
        this.clearForm();
    }
}
