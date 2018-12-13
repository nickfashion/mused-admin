import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { ROOT_STORE } from "../../../stores";

import Main from './Main';

function MainHOC(Main) {
    @inject(ROOT_STORE)

    @observer
    class NewComp extends Component {
        
        componentDidMount() {
            const { root: { products } } = this.props;
            const { getAllProducts } = products;

            getAllProducts();
        }

        render() {
            const { root: { products } } = this.props;
            const { listOfProducts } = products;
            return <Main
                products={listOfProducts}
            />
        }

    }
    return NewComp;
}

export default MainHOC(Main);
