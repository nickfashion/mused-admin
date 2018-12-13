import React, { Component } from 'react';
import classNames from 'classnames';
import {
    Container, Row, Col,
    TabContent, TabPane,
    Nav, NavItem, NavLink
} from 'reactstrap';
import { ListBuilder } from "../../list-builder";
import { PostsInspire, PostsList, PostsProduct, PostsInstagram, PostRetailer } from "../../posts";
import { AuthInfo } from "../../auth-info";
import { PRODUCTS_TAB, POSTS_INSPIRE_TAB, POSTS_LIST_TAB, POSTS_PRODUCT_TAB, POSTS_RETAILER_TAB, POSTS_INSTAGRAM_TAB, tabList } from '../constants';
const theme = require('./theme.css');

export default class Main extends Component {
    state = {
        activeTab: 'products'
    };

    render() {
        const { products } = this.props;
        if (!products.length) {
            return <Container>
                <div className={theme.loadingContainer}>
                    <p>Loading ...</p>
                </div>
            </Container>
        };
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
                            <TabPane tabId={PRODUCTS_TAB}>
                                <ListBuilder />
                            </TabPane>
                            <TabPane tabId={POSTS_INSPIRE_TAB}>
                                <PostsInspire />
                            </TabPane>
                            <TabPane tabId={POSTS_LIST_TAB}>
                                <PostsList />
                            </TabPane>
                            <TabPane tabId={POSTS_PRODUCT_TAB}>
                                <PostsProduct />
                            </TabPane>
                            <TabPane tabId={POSTS_RETAILER_TAB}>
                                <PostRetailer />
                            </TabPane>
                            <TabPane tabId={POSTS_INSTAGRAM_TAB}>
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
