import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { ROOT_STORE } from "../../../stores";

import Posts from './Posts';

function CollectionHOC(Posts) {
    @inject(ROOT_STORE)

    @observer
    class NewComp extends Component {

        postType = 'postsList';
    
        componentDidMount() {
            const { root: { posts } } = this.props;
            const { getListPosts } = posts;
            getListPosts();
        }

        render() {
            const { root: { posts } } = this.props;
            const { listOfPostsList, addNewPostList } = posts;

            return <Posts
                posts={listOfPostsList}
                getPostData={this._getPostData}
                setPostData={this._setPostData}
                addNewPost={addNewPostList}
                deletePost={this._deletePost}
            />
        }

        _deletePost = (id) => {
            const { root: { posts } } = this.props;
            const {  deletePost } = posts;
            deletePost(id, this.postType);
        }

        _getPostData = (id) => {
            const { root: { posts } } = this.props;
            const {  getPostData } = posts;
            return getPostData(id, this.postType);
        }

        _setPostData = (post) => {
            const { root: { posts } } = this.props;
            const {  setPostData } = posts;
            return setPostData(post, this.postType);
        }

    }
    return NewComp;
}

export default CollectionHOC(Posts);
