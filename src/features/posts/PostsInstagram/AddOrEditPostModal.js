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

const INST_SLOTS = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
];



export default class AddOrEditPostModal extends Component {
    type = types.add;

    initInstaSlot = {
        instagramURL: '',
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
    }
    getInitInstagramSlots = () => {
        return INST_SLOTS.map((slotNumber) => {
            return {
                postTitle: `Instagram Embed ${slotNumber}`,
                ...this.initInstaSlot
            }
        })
    }
    state = {
        title: '',
        timeAgo: 0,
        date: '',
        inspirationalImageURL: '',

        instagramSlots: this.getInitInstagramSlots(),

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
                    instagramSlots: slots
                })
            } else {
                this.type = types.add;
            }
        }
    }


    savePost = () => {
        const { setPostData, addNewPost, postId } = this.props;
        const {
            title,
            inspirationalImageURL,
            timeAgo,
            date
        } = this.state;
        const post = {
            title,
            date: this.type === types.add ? new Date(dateMinusHours(timeAgo)) : date,
            inspirationalImage: inspirationalImageURL,
            slots: this.setSlots(),
            postType: 'instagram'
        };

        this.type === types.edit ? setPostData({ postId, ...post }) : addNewPost(post);
        this.onCloseForm();
    };

    setSlots = () => {
        return this.state.instagramSlots.map((instSlot, instIndex) => {
            const slots = SLOTS.map((slot, i) => {
                const productId = instSlot[`slot${i + 1}Product`];
                if (!productId) return null;
                const alts = this.getAlternatives(instIndex, i);
                return {
                    productId: +productId,
                    alternatives: alts,
                };
            }).filter(Boolean);
            return {
                instagramURL: instSlot.instagramURL,
                slots
            }
        }).filter(instaSlots => instaSlots.slots.length);
    };

    getAlternatives = (instIndex, slotNumber) => {
        const { getProductsIdsByCategory, categories } = this.props;
        const countAlts = this.state.instagramSlots[instIndex][`count${slotNumber + 1}Alts`];
        const category = this.state.instagramSlots[instIndex][`category${slotNumber + 1}`] || categories[0];
        return getProductsIdsByCategory(category, countAlts);
    };

    getSlots = (instSlots) => {
        if (!instSlots.length) return this.getInitInstagramSlots();
        const postsSlots = instSlots.map((_instSlot, instIndex) => {
            const instSlot = {
                postTitle: `Instagram Embed ${instIndex + 1}`,
                instagramURL: _instSlot.instagramURL
            };
            _instSlot.slots.forEach((slot, i) => {
                instSlot[`slot${i + 1}Product`] = slot.productId;
                instSlot[`category${i + 1}`] = this.props.getCategoryByProductId(slot.alternatives[0]);
                instSlot[`count${i + 1}Alts`] = slot.alternatives.length;
            });
            return instSlot;
        });
        if (postsSlots.length < 10) {
            const postsLength = postsSlots.length;
            const initSlots = this.getInitInstagramSlots();
            initSlots.splice(0, postsLength, ...postsSlots);
            return initSlots;
        } else {
            return postsSlots;
        }
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
                                {this.renderInstagramSlots()}
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

    renderSlots = (instIndex) =>
        SLOTS.map((slot, i) => {
            return (
                <Col style={{ width: '20%' }} key={i}>
                    <FormGroup>
                        <Label for={`slot${slot}`}>{`Slot #${slot} Product Id`}</Label>
                        <Input
                            value={this.state.instagramSlots[instIndex][`slot${slot}Product`]}
                            onChange={(event) => this.handleSlotProduct(slot, instIndex, event.target.value)}
                            id={`slot${slot}`}
                            type="text" />
                        <Label >{`Slot #${slot} Alternatives`}</Label>
                        <Dropdown
                            currentValue={this.state.instagramSlots[instIndex][`category${slot}`] || 'Category'}
                            changeItem={(event) => this.handleCat(slot, instIndex, event.target.innerText)}
                            valuesList={this.props.categories} />
                        <Label for={`count${slot}Alts`}>{`Number of alternatives`}</Label>
                        <Input
                            value={this.state.instagramSlots[instIndex][`count${slot}Alts`]}
                            onChange={(event) => this.handleCountAlts(slot, instIndex, event.target.value)}
                            id={`count${slot}Alts`}
                            type="text" />
                    </FormGroup>
                </Col>
            )
        });

    renderInstagramSlots = () =>
        this.state.instagramSlots.map((slot, i) => {
            return (
                <FormGroup key={i}>
                    <Label color="primary" className={theme.instPostTitle}>{slot.postTitle}</Label>
                    <FormGroup>
                        <Label size="sm" for="instagramURL">Instagram URL</Label>
                        <Input
                            value={this.state.instagramSlots[i].instagramURL}
                            onChange={(event) => this.handleInstagramURL(i, event.target.value)}
                            id="instagramURL"
                            type="text" />
                    </FormGroup>
                    <Row >
                        {this.renderSlots(i)}
                    </Row>
                </FormGroup>
            );
        })

    clearForm = () => this.setState({
        title: '',
        timeAgo: 0,
        inspirationalImageURL: '',
        instagramSlots: this.getInitInstagramSlots(),
    });

    handleInspirationalImage = (event) => this.setState({ inspirationalImageURL: event.target.value });
    handleTitle = (event) => this.setState({ title: event.target.value });
    handleTimeAgo = (event) => this.setState({ timeAgo: event.target.value });
    handleInstagramURL = (instIndex, value) => {
        const instSlot = { ...this.state.instagramSlots[instIndex] };
        instSlot.instagramURL = value;
        this.updateInstagramSlots(instIndex, instSlot);
    };

    handleSlotProduct = (slot, instIndex, value) => {
        if (!(isNumber(value) || value === '')) {
            return;
        }
        const instSlot = { ...this.state.instagramSlots[instIndex] };
        instSlot[`slot${slot}Product`] = value;
        this.updateInstagramSlots(instIndex, instSlot);
    };

    handleCountAlts = (slot, instIndex, value) => {
        if (!(isNumber(value) || value === '')) {
            return;
        }
        const instSlot = { ...this.state.instagramSlots[instIndex] };
        instSlot[`count${slot}Alts`] = value;
        this.updateInstagramSlots(instIndex, instSlot);
    }
    handleCat = (slot, instIndex, value) => {
        const instSlot = { ...this.state.instagramSlots[instIndex] };
        instSlot[`category${slot}`] = value;
        this.updateInstagramSlots(instIndex, instSlot);
    }
    updateInstagramSlots = (instIndex, instSlot) => {
        const instagramSlots = [...this.state.instagramSlots];
        instagramSlots.splice(instIndex, 1, instSlot);
        this.setState({ instagramSlots });
    }
    onCloseForm = () => {
        this.props.onClose();
        this.clearForm();
    }
}
