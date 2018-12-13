import { observable, action, computed } from 'mobx';
import _ from 'lodash'

import { getAllProducts } from '../services';
import { unusedCategories, COLORS } from './constants';

const CHUNK_SIZE = 100;

export default class ObservableStore {
    constructor(root) { }

    allProducts = [];
    @observable products = [];
    @observable categories = [];
    @observable pagination = 0;
    @observable selectedIds = [];
    @observable colors = COLORS;

    @computed get listOfProducts() {
        return this.products.slice(
            this.pagination * CHUNK_SIZE,
            (this.pagination + 1) * CHUNK_SIZE);
    }
    @computed get paginationLength() {
        return parseInt(this.products.length / CHUNK_SIZE);
    }
    get allCategories() {
        return this.categories;
    }
    get allColors() {
        return this.colors;
    }
    get listOfIds() {
        return this.selectedIds;
    }
    get listOfCategories() {
        return this.categories;
    }


    @action
    paginate = (n) => {
        if (typeof n === 'string') {
            return n === 'prev' ? this.decrPaginate() : this.incPaginate()
        }
        this.pagination = n;
        return this.pagination;
    };
    incPaginate = () => {
        const maxSize = this.allProducts.length / CHUNK_SIZE;
        return this.pagination === maxSize ? 0 : this.pagination += 1;
    };
    decrPaginate = () => {
        return this.pagination === 0 ? 0 : this.pagination -= 1;
    };

    filterProductsByParams = (category, color, searchQuery) => {
        let filteredProducts = category
            ? this.allProducts.filter(product => product.category === category)
            : this.allProducts;
        filteredProducts = color
            ? filteredProducts.filter(product => product.colors.includes(color))
            : filteredProducts;
        filteredProducts = searchQuery
            ? filteredProducts.filter(product => product.description.toLowerCase().includes(searchQuery.toLowerCase()))
            : filteredProducts;
        this.products = filteredProducts;
    };

    filterProductsBySearchQuery = (searchQuery) => {
        let filteredProducts = searchQuery
            ? this.products.filter(product => product.description.toLowerCase().includes(searchQuery.toLowerCase()))
            : this.products;
        this.products = filteredProducts;
    }


    @action
    setFilterParams = (category, color, searchQuery) => {
        this.pagination = 0;
        this.filterProductsByParams(category, color, searchQuery);
    };

    @action
    addIdToList = (id) => {
        if (!this.selectedIds.includes(id)) {
            this.selectedIds = [id, ...this.selectedIds];
        }
    };

    @action
    removeIdFromList = (id) => {
        _.remove(this.selectedIds, n => n === id);
        this.selectedIds = [...this.selectedIds]; //trigger change
    };

    @action
    getAllProducts = async () => {
        // this.allProducts = await getAllProducts();
        await getAllProducts().then(products => {
            this.allProducts = products;
            this.products = products;
            this.categories = this.getCategories();
        })

    };

    getCategories = () => {
        if (!this.allProducts.length) return [];
        let categories = [];
        this.allProducts.forEach(product => {
            if (unusedCategories.includes(product.category)) {
                return;
            }
            if (!categories.includes(product.category)) {
                categories = [...categories, product.category]
            }
        });
        return categories;
    }
}
