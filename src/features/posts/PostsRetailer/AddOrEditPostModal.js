import React, { Component } from 'react';
import { Row, Col, Button, Form, FormGroup, Label, Input, Alert, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { isNumber, dateMinusHours } from '../../../services/utils'
import { Dropdown } from '../../shared';

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


export default class AddOrEditPostModal extends Component {
    type = types.add;

    state = {
        timeAgo: 0,
        date: '',
        inspirationalImageURL: '',
        hidden: 0,

        slot1Product: '',
        slot2Product: '',
        slot3Product: '',
        slot4Product: '',
        slot5Product: '',

        category1: '',
        category2: '',
        category3: '',
        category4: '',
        category5: '',

        count1Alts: '',
        count2Alts: '',
        count3Alts: '',
        count4Alts: '',
        count5Alts: '',

        errorMsg: null
    };

    componentDidUpdate(prevProps) {
        if (this.props.isOpen !== prevProps.isOpen && this.props.isOpen === true) {
            const { postId, getPostData } = this.props;

            if (postId) {
                const postData = getPostData(postId);
                this.type = types.edit;
                const slots = this.getSlots(postData.slots);
                this.setState({
                    title: postData.title || '',
                    date: postData.date || '',
                    inspirationalImageURL: postData.inspirationalImage || '',
                    hidden: typeof postData.hidden !== 'undefined' && postData.hidden || 0,
                    ...slots
                })
            } else {
                this.type = types.add;
            }
        }
    }

    getSlots = slots => {
        const s1 = {};
        if (!slots) return s1;
        slots.forEach((slot, i) => {
            s1[`slot${i + 1}Product`] = slot.productId;
            // make sure that slot.alternatives[0] exist
            s1[`category${i + 1}`] = this.props.getCategoryByProductId(slot.alternatives[0]);
            s1[`count${i + 1}Alts`] = slot.alternatives.length;
        });

        return s1;
    };

    savePost = () => {
        const { setPostData, addNewPost, postId } = this.props;
        const {
            title,
            inspirationalImageURL,
            timeAgo,
            date,
            hidden
        } = this.state;
        const post = {
            title,
            date: this.type === types.add ? new Date(dateMinusHours(timeAgo)) : date,
            inspirationalImage: inspirationalImageURL,
            hidden: Number(hidden),
            slots: this.setSlots()
        };

        this.type === types.edit ? setPostData({ postId, ...post }) : addNewPost(post);
        this.onCloseForm();
    };

    setSlots = () => {
        return SLOTS.map((slot, i) => {
            const productId = this.state[`slot${i + 1}Product`];
            if (!productId) return null;
            const alts = this.getAlternatives(i);
            return {
                productId: +productId,
                alternatives: alts,
            };
        }).filter(Boolean);
    };

    getAlternatives = (slotNumber) => {
        const { getProductsIdsByCategory, categories } = this.props;
        const countAlts = this.state[`count${slotNumber + 1}Alts`];
        const category = this.state[`category${slotNumber + 1}`] || categories[0];
        return getProductsIdsByCategory(category, countAlts);
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
                                    <Label for="inspirationalImage">Inspirational Image URL</Label>
                                    <Input
                                        value={this.state.inspirationalImageURL}
                                        onChange={this.handleInspirationalImage}
                                        id="inspirationalImage"
                                        type="text" />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Hidden</Label>
                                    <Dropdown
                                        currentValue={this.getHiddenValue(this.state.hidden) || 'Select Hidden'}
                                        valuesList={['0', '1']}
                                        changeItem={this.handleHidden}
                                    />
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
        SLOTS.map((slot, i) => {
            return (
                <Col style={{ width: '20%' }} key={i}>
                    <FormGroup>
                        <Label for={`slot${slot}`}>{`Slot #${slot} Product Id`}</Label>
                        <Input
                            value={this.state[`slot${slot}Product`]}
                            onChange={(event) => this.handleSlotProduct(slot, event.target.value)}
                            id={`slot${slot}`}
                            type="text" />
                        <Label>{`Slot #${slot} Alternatives`}</Label>
                        <Dropdown
                            currentValue={this.state[`category${slot}`] || 'Category'}
                            changeItem={(event) => this.handleCat(slot, event)}
                            valuesList={this.props.categories} />
                        <Label for={`count${slot}Alts`}>{`Number of alternatives`}</Label>
                        <Input
                            value={this.state[`count${slot}Alts`]}
                            onChange={(event) => this.handleCountAlts(slot, event)}
                            id={`count${slot}Alts`}
                            type="text" />
                    </FormGroup>
                </Col>
            )
        });

    clearForm = () => this.setState({
        title: '',
        timeAgo: 0,
        inspirationalImageURL: '',
        hidden: 0,

        slot1Product: '',
        slot2Product: '',
        slot3Product: '',
        slot4Product: '',
        slot5Product: '',

        category1: '',
        category2: '',
        category3: '',
        category4: '',
        category5: '',

        count1Alts: '',
        count2Alts: '',
        count3Alts: '',
        count4Alts: '',
        count5Alts: '',
    });

    handleInspirationalImage = (event) => this.setState({ inspirationalImageURL: event.target.value });
    handleTitle = (event) => this.setState({ title: event.target.value });
    handleTimeAgo = (event) => this.setState({ timeAgo: event.target.value });
    handleCat = (slot, event) => this.setState({ [`category${slot}`]: event.target.innerText });
    handleHidden = (event) => this.setState({ hidden: event.target.innerText });
    handleCountAlts = (slot, event) => {
        if (!(isNumber(event.target.value ) || event.target.value === '')) {
            return;
        }
        this.setState({ [`count${slot}Alts`]: event.target.value })
    };
    handleSlotProduct = (slot, value) => {
        (isNumber(value) || value === '') &&
            this.setState({ [`slot${slot}Product`]: value });
    };
    getHiddenValue = (hidden) => {
        return hidden == '0'
            ? 'no'
            : 'yes';
    }
    onCloseForm = () => {
        this.props.onClose();
        this.clearForm();
    }
}
