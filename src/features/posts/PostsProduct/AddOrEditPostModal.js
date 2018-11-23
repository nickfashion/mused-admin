import React, { Component } from 'react';
import { Row, Col, Button, Form, FormGroup, Label, Input, Alert, Modal, ModalHeader, ModalBody, ModalFooter,  Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
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

export default class AddOrEditPostModal extends Component {
    type = types.add;

    state = {
        title: '',
        authorName: '',
        timeAgo: 0,
        date: '',
        authorProfilePhotoURL: '',
        inspirationalImageURL: '',
        pin: '',
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
                    date: postData.date || '',
                    authorProfilePhotoURL: postData.authorProfilePhoto || '',
                    inspirationalImageURL: postData.inspirationalImage || '',
                    productId: postData.productId || '',
                    pin: typeof postData.pin !== 'undefined' && postData.pin.toString() || '',
                })
            } else {
                this.type = types.add;
                this.clearForm();
            }
        }
    }

    savePost = () => {
        const { onClose, setPostData, addNewPost, postId } = this.props;
        const {
            title,
            authorName,
            authorProfilePhotoURL,
            inspirationalImageURL,
            timeAgo,
            date,
            pin
        } = this.state;
        const post = {
            title,
            authorName,
            date: this.type === types.add ? new Date(dateMinusHours(timeAgo)) : date,
            authorProfilePhoto: authorProfilePhotoURL,
            inspirationalImage: inspirationalImageURL,
            productId: Number(this.state.productId),
            pin: Number(pin),
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
                                {
                                    type === types.add &&
                                    <FormGroup>
                                        <Label for="timeAgo">Time ago</Label>
                                        <Input
                                            value={this.state.timeAgo}
                                            onChange={this.handleTimeAgo}
                                            id="timeAgo"
                                            type="number"
                                            min="0" max="24" />
                                    </FormGroup>
                                }
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
                                <FormGroup>
                                    <Label for="pin">Pin</Label>
                                    <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown} id="pin">
                                        <DropdownToggle caret>
                                            {Boolean(this.state.pin) && this.state.pin || 'Select Pin'} 
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            {
                                                ['0', '1', '2', '3'].map(
                                                (value, index) => 
                                                <DropdownItem 
                                                    active={value === this.state.pin}
                                                    onClick={this.handlePin}
                                                    key={index}>{value}
                                                </DropdownItem>)
                                            }
                                        </DropdownMenu>
                                    </Dropdown>
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
        timeAgo: 0,
        authorProfilePhotoURL: '',
        inspirationalImageURL: '',
        pin: '',
        productId: ''
    });

    handleAuthorNameChange = (event) => this.setState({authorName: event.target.value});
    handleAuthorProfilePhoto = (event) => this.setState({authorProfilePhotoURL: event.target.value});
    handleTitle = (event) => this.setState({title: event.target.value});
    handleInspirationalImage = (event) => this.setState({inspirationalImageURL: event.target.value});
    handleTimeAgo = (event) => this.setState({timeAgo: event.target.value});
    handlePin = (event) => this.setState({pin: event.target.innerText})



    handleProductId = (value) => {
        (isNumber(value) || value === '') &&
            this.setState({productId: value});
    };

    toggleDropdown = () => {
        this.setState(prevState => ({
          dropdownOpen: !prevState.dropdownOpen
        }));
      }

}
