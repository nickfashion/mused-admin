import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { ROOT_STORE } from "../../../stores";

import Posts from './Posts';

function PostsHOC(Posts) {
    @inject(ROOT_STORE)

    @observer
    class NewComp extends Component {

        postType = 'postsRandom';
        collectionType = 'random';
    
        componentDidMount() {
            const { root: { posts } } = this.props;
            const { getRandomPosts } = posts;
            getRandomPosts();
        }

        render() {
            const { root: { posts } } = this.props;
            const { listOfPostsRandom, addNewPostRandom } = posts;

            return <Posts
                posts={listOfPostsRandom}
                getPostData={this._getPostData}
                setPostData={this._setPostData}
                addNewPost={addNewPostRandom}
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
