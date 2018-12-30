import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { ROOT_STORE } from "../../../stores";

import Posts from './Posts';

function PostsHOC(Posts) {
    @inject(ROOT_STORE)

    @observer
    class NewComp extends Component {

        postType = 'postsRetailer';
        collectionType = 'merchantposts';
    
        componentDidMount() {
            const { root: { posts } } = this.props;
            const { getRetailerPosts } = posts;
            getRetailerPosts();
        }

        render() {
            const { root: { posts, products } } = this.props;
            const { listOfPostsRetailer, addNewPostRetailer} = posts;
            const { listOfCategories, getProductsIdsByCategory, getCategoryByProductId } = products;

            return <Posts
                posts={listOfPostsRetailer}
                getPostData={this._getPostData}
                setPostData={this._setPostData}
                addNewPost={addNewPostRetailer}
                deletePost={this._deletePost}
                categories={listOfCategories}
                getProductsIdsByCategory={getProductsIdsByCategory}
                getCategoryByProductId={getCategoryByProductId}
            />
        }


        _deletePost = (id) => {
            const { root: { posts } } = this.props;
            const {  deletePostSinColById } = posts;
            deletePostSinColById(id, this.postType, this.collectionType);
        }

        _getPostData = (id) => {
            const { root: { posts } } = this.props;
            const {  getPostData } = posts;
            return getPostData(id, this.postType);
        }

        _setPostData = (post) => {
            const { root: { posts } } = this.props;
            const {  setPostData } = posts;
            return setPostData(post, this.postType, this.collectionType);
        }

    }
    return NewComp;
}

export default PostsHOC(Posts);
