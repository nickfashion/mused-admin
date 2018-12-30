import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { ROOT_STORE } from "../../../stores";

import Posts from './Posts';

function PostsHOC(Posts) {
    @inject(ROOT_STORE)

    @observer
    class NewComp extends Component {

        postType = 'postsMatch';
        collectionType = 'matchposts';
    
        componentDidMount() {
            const { root: { posts } } = this.props;
            const { getMatchPosts } = posts;
            getMatchPosts();
        }

        render() {
            const { root: { posts } } = this.props;
            const { listOfPostsMatch, addNewPostMatch } = posts;

            return <Posts
                posts={listOfPostsMatch}
                getPostData={this._getPostData}
                setPostData={this._setPostData}
                addNewPost={addNewPostMatch}
                deletePost={this._deletePost}
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
