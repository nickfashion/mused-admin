import React, { Component } from 'react';
import {
    Container, Row, Col,
    Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Input
} from 'reactstrap';
import ListBuilderItem from "./ListBuilderItem";
import SelectedIDs from "./SelectedIDs";
import { Pagination } from '../../pagination';

const theme = require('../theme.css');

export default class ListBuilder extends Component {
    state = {
        dropdownCategoryOpen: false,
        dropdownColorOpen: false,
        currentCategory: null,
        currentColor: null,
        searchValue: ''
    };

    render() {
        const { products, listOfIds, removeIdFromList } = this.props;

        return (
            <div>
                <Container style={{ width: '80%', float: 'left' }}>
                    <Row>
                        <Col xs='6'>
                            <Pagination />
                        </Col>
                        <Col xs='6'>
                           {this._renderSearchInput()}
                        </Col>
                    </Row>
                    <Row className={theme.listWrapper}>
                        {this._renderListOfProducts(products)}
                    </Row>
                </Container>
                <Container style={{ width: '20%', float: 'right' }}>
                    {this._renderCategoryDropdown()}
                    {this._renderColorDropdown()}
                    <SelectedIDs
                        ids={listOfIds}
                        removeId={removeIdFromList}
                    />
                </Container>
            </div>
        )
    }

    _renderListOfProducts = (products) => {
        if (!products.length) return null;

        return products.map((product, i) => (
            <ListBuilderItem
                key={i}
                product={product}
                addId={this.props.addIdToList}
            />
        ));
    };

    _renderCategoryDropdown = () => {
        const { categories } = this.props;
        return (
            <Dropdown isOpen={this.state.dropdownCategoryOpen} toggle={() => this._toggle('dropdownCategoryOpen')} className={theme.selectWrapper}>
                <DropdownToggle caret>
                    {this.state.currentCategory || "Categories"}
                </DropdownToggle>
                <DropdownMenu>
                    {this.state.currentCategory &&
                        <DropdownItem
                            onClick={() => this._onCategorySelected(null)}
                            key={0}>
                            {"All"}
                        </DropdownItem>}
                    {categories.map((category, i) => (
                        <DropdownItem
                            onClick={() => this._onCategorySelected(category)}
                            key={i + 1}>
                            {category}
                        </DropdownItem>))}
                </DropdownMenu>
            </Dropdown>
        );
    }

    _renderColorDropdown = () => {
        const { colors } = this.props;
        return (
            <Dropdown isOpen={this.state.dropdownColorOpen} toggle={() => this._toggle('dropdownColorOpen')} className={theme.selectWrapper}>
                <DropdownToggle caret>
                    {this.state.currentColor || "Colors"}
                </DropdownToggle>
                <DropdownMenu>
                    {this.state.currentColor &&
                        <DropdownItem
                            onClick={() => this._onColorSelected(null)}
                            key={0}>
                            {"All"}
                        </DropdownItem>}
                    {colors.map((color, i) => (
                        <DropdownItem
                            onClick={() => this._onColorSelected(color)}
                            key={i + 1}>
                            {color}
                        </DropdownItem>))}
                </DropdownMenu>
            </Dropdown>
        );
    }

    _renderSearchInput = () => {
        return (
            <Input
                className={theme.input}
                value={this.state.searchValue}
                type="text" placeholder="SEARCH BY DESCRIPTION"
                onChange={this._changeSearchValue} />
        )
    }


    _onCategorySelected = category => {
        const { currentCategory, currentColor, searchValue } = this.state;
        if (category === currentCategory) return;

        this.props.setFilterParams(category, currentColor, searchValue);
        this.setState({ currentCategory: category })
    };

    _onColorSelected = color => {
        const { currentCategory, currentColor, searchValue } = this.state;
        if (color === currentColor) return;

        this.props.setFilterParams(currentCategory, color, searchValue);
        this.setState({ currentColor: color })
    };

    _changeSearchValue = (event) => {
        const { currentCategory, currentColor } = this.state;
        this.props.setFilterParams(currentCategory, currentColor, event.target.value);
        this.setState({searchValue: event.target.value})
    }

    _toggle = (type) => {
        this.setState({
            [type]: !this.state[type]
        });
    }
};
