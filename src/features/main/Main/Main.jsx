import React, { Component } from 'react';
import classNames from 'classnames';
import {
    Container, Row, Col,
    TabContent, TabPane,
    Nav, NavItem, NavLink
} from 'reactstrap';
import { ListBuilder } from "../../list-builder";
import { PostsInspire, PostsList, PostsProduct, PostsInstagram } from "../../posts";
import { AuthInfo } from "../../auth-info";
import { PRODUCTS_TAB, POSTS_INSPIRE_TAB, POSTS_LIST_TAB, POSTS_PRODUCT_TAB, POSTS_RETAILER_TAB, POSTS_INSTAGRAM_TAB } from '../constants';

const tabList = [
    {
        name: PRODUCTS_TAB,
        text: 'List of Products'
    },
    {
        name: POSTS_INSPIRE_TAB,
        text: 'Posts (Inspire)'
    },
    {
        name: POSTS_LIST_TAB,
        text: 'Posts (List)'
    },
    {
        name: POSTS_PRODUCT_TAB,
        text: 'Posts (Product)'
    },
    {
        name: POSTS_RETAILER_TAB,
        text: 'Posts (Retailer)'
    },
    {
        name: POSTS_INSTAGRAM_TAB,
        text: 'Posts (Instagram)'
    }
];

export default class Main extends Component {
    state = {
        activeTab: 'products'
    };

    render() {

        return (
            <Container>
                <Row key={"header"}>
                    <AuthInfo />
                </Row>
                <Row key={"navigation"}>
                    <Col xs='12'>
                        <Nav tabs>
                            {tabList.map(this.renderTab)}
                        </Nav>
                    </Col>
                </Row>
                <Row key={"tab-content"}>
                    <Col xs='12'>
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="products">
                                <ListBuilder />
                            </TabPane>
                            <TabPane tabId="postsInspire">
                                <PostsInspire />
                            </TabPane>
                            <TabPane tabId="postsList">
                                <PostsList />
                            </TabPane>
                            <TabPane tabId="postsProduct">
                                <PostsProduct />
                            </TabPane>
                            <TabPane tabId="postsInstagram">
                                <PostsInstagram />
                            </TabPane>
                        </TabContent>
                    </Col>
                </Row>
            </Container>)
    }

    toggleTab = (tab) => {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    renderTab = (tabInfo, index) => {
        return (
            <NavItem key={index}>
                <NavLink
                    className={classNames({ active: this.state.activeTab === tabInfo.name })}
                    onClick={() => { this.toggleTab(tabInfo.name); }}
                >
                    {tabInfo.text}
                </NavLink>
            </NavItem>
        )
    }
};
