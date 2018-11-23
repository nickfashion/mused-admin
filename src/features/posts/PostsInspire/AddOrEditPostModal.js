import React, { Component } from 'react';
import { Row, Col, Button, Form, FormGroup, Label, Input, Alert, Modal, ModalHeader, ModalBody, ModalFooter, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
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

const SLOTS = [
    1, 2, 3, 4, 5
];

const getSlots = slots => {
    const s1 = {};
    if (!slots) return s1;
    slots.forEach((slot, i) => {
        s1[`slot${i + 1}Product`] = slot.productId;
        s1[`slot${i + 1}Alts`] = slot.alternatives.join('\n');
    });

    return s1;
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
        backgroundImageURL: '',
        pin: '',

        slot1Product: '',
        slot2Product: '',
        slot3Product: '',
        slot4Product: '',
        slot5Product: '',

        slot1Alts: '',
        slot2Alts: '',
        slot3Alts: '',
        slot4Alts: '',
        slot5Alts: '',

        dropdownOpen: false,

        errorMsg: null
    };

    componentDidUpdate(prevProps) {
        if (this.props.isOpen !== prevProps.isOpen && this.props.isOpen === true) {
            const { postId, getPostData } = this.props;

            if (postId) {
                const postData = getPostData(postId);

                this.type = types.edit;
                const slots = getSlots(postData.slots);
                this.setState({
                    title: postData.title || '',
                    authorName: postData.authorName || '',
                    date: postData.date || '',
                    authorProfilePhotoURL: postData.authorProfilePhoto || '',
                    inspirationalImageURL: postData.inspirationalImage || '',
                    backgroundImageURL: postData.backgroundImage || '',
                    pin: typeof postData.pin !== 'undefined' && postData.pin.toString() || '',
                    ...slots
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
            backgroundImage,
            authorProfilePhotoURL,
            inspirationalImageURL,
            pin, 
            timeAgo,
            date
        } = this.state;
        const post = {
            title,
            authorName,
            date: this.type === types.add ? new Date(dateMinusHours(timeAgo)) : date,
            authorProfilePhoto: authorProfilePhotoURL,
            inspirationalImage: inspirationalImageURL,
            pin: Number(pin),
            backgroundImage,
            slots: this.setSlots(),
            postType: 'inspire'
        };

        this.type === types.edit ? setPostData({postId, ...post}) : addNewPost(post);
        onClose()
    };

    setSlots = () => {
        return SLOTS.map((slot, i) => {
            const productId = this.state[`slot${i + 1}Product`];
            if (!productId) return null;
            const alts = this.getAlternatives(this.state[`slot${i + 1}Alts`]);
            return {
                productId: +productId,
                alternatives: alts,
            };
        }).filter(Boolean);
    };

    getAlternatives = (alternatives) => {
        return alternatives ?
            alternatives.split('\n').filter(Boolean).map(id => +id) :
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
                                    <Label for="backgroundImageURL">Background Image URL</Label>
                                    <Input
                                        value={this.state.backgroundImageURL}
                                        onChange={this.handleBackgroundImage}
                                        id="backgroundImageURL"
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
        SLOTS.map((slot, i) => {
            return (
                <Col style={{width: '20%'}} key={i}>
                    <FormGroup>
                        <Label for={`slot${slot}`}>{`Slot #${slot} Product Id`}</Label>
                        <Input
                            value={this.state[`slot${slot}Product`]}
                            onChange={(event) => this.handleSlotProduct(slot, event.target.value)}
                            id={`slot${slot}`}
                            type="text" />
                        <Label for={`slot${slot}Alts`}>{`Slot #${slot} Alternatives`}</Label>
                        <Input
                            value={this.state[`slot${slot}Alts`]}
                            onChange={(event) => this.handleSlotAlts(slot, event.target.value)}
                            id={`slot${slot}Alts`}
                            type="textarea"
                            rows="8" />
                    </FormGroup>
                </Col>
            )
        });

    clearForm = () => this.setState({
        title: '',
        authorName: '',
        timeAgo: 0,
        authorProfilePhotoURL: '',
        inspirationalImageURL: '',
        pin: '',
        backgroundImageURL: '',
        slot1Product: '',
        slot2Product: '',
        slot3Product: '',
        slot4Product: '',
        slot5Product: '',
        slot1Alts: '',
        slot2Alts: '',
        slot3Alts: '',
        slot4Alts: '',
        slot5Alts: '',
    });

    handleAuthorNameChange = (event) => this.setState({authorName: event.target.value});
    handleAuthorProfilePhoto = (event) => this.setState({authorProfilePhotoURL: event.target.value});
    handleInspirationalImage = (event) => this.setState({inspirationalImageURL: event.target.value});
    handleBackgroundImage = (event) => this.setState({backgroundImageURL: event.target.value});
    handleTitle = (event) => this.setState({title: event.target.value});
    handleTimeAgo = (event) => this.setState({timeAgo: event.target.value});
    handlePin = (event) => this.setState({pin: event.target.innerText})

    handleSlotProduct = (slot, value) => {
        (isNumber(value) || value === '') &&
            this.setState({[`slot${slot}Product`]: value});
    };
    handleSlotAlts = (slot, value) => {
        (isNumber(value.replace(/\n/g,'')) || value === '') &&
            this.setState({[`slot${slot}Alts`]: value});
    }
    toggleDropdown = () => {
        this.setState(prevState => ({
          dropdownOpen: !prevState.dropdownOpen
        }));
      }
}
