import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { ROOT_STORE } from "../../../stores";

import ListBuilder from './ListBuilder';

function ListBuilderHOC(ListBuilder) {
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
            const {
                listOfProducts, allCategories, listOfIds,
                setFilterParams, addIdToList, removeIdFromList, allColors
            } = products;

            return <ListBuilder
                products={listOfProducts}
                categories={allCategories}
                colors={allColors}
                addIdToList={addIdToList}
                removeIdFromList={removeIdFromList}
                listOfIds={listOfIds}
                setFilterParams={setFilterParams}
            />
        }

    }
    return NewComp;
}

export default ListBuilderHOC(ListBuilder);
