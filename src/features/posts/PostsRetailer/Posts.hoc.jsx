import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { ROOT_STORE } from "../../../stores";

import Posts from './Posts';

function PostsHOC(Posts) {
    @inject(ROOT_STORE)

    @observer
    class NewComp extends Component {

        postType = 'postsRetailer';
    
        componentDidMount() {
            const { root: { posts } } = this.props;
            const { getRetailerPosts } = posts;
            getRetailerPosts();
        }

        render() {
            const { root: { posts } } = this.props;
            const { listOfPostsRetailer, addNewPostRetailer} = posts;

            return <Posts
                posts={listOfPostsRetailer}
                getPostData={this._getPostData}
                setPostData={this._setPostData}
                addNewPost={addNewPostRetailer}
                deletePost={this._deletePost}
            />
        }


        _deletePost = (id) => {
            const { root: { posts } } = this.props;
            const {  deletePostRetailer } = posts;
            deletePostRetailer(id, this.postType);
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

export default PostsHOC(Posts);
