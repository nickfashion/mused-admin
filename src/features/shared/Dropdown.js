import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { cutString } from '../../services';

export default class DropdownField extends Component {
    state = {
        isOpen: false
    }
    render() {
        const { currentValue, changeItem, valuesList } = this.props;
        return (
            <Dropdown isOpen={this.state.isOpen} toggle={this.toggleDropdown}>
                <DropdownToggle caret>
                    {cutString(currentValue, 8)}
                </DropdownToggle>
                <DropdownMenu>
                    {
                        valuesList.map(
                            (value, index) =>
                                <DropdownItem
                                    active={value === currentValue}
                                    onClick={changeItem}
                                    key={index}>{value}
                                </DropdownItem>)
                    }
                </DropdownMenu>
            </Dropdown>
        )
    }
    toggleDropdown = () => {
        this.setState(prevState => ({
            isOpen: !prevState.isOpen
        }));
    }
}