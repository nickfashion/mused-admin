import { observable, action } from 'mobx';
import _ from 'lodash'
import { getAllPosts, addPost, deletePostById, updatePost } from '../services';

export default class ObservableStore {
    constructor(root) {}

    @observable posts = [];

    get listOfPosts (){
        return this.posts;
    }

    @action
    getAllPosts = async () => {
        this.posts = await getAllPosts();
    };

    @action
    setPostData = async (post) => {
        const updatedPost = await updatePost(post);
        this.collectionUpdatePost({...updatedPost, _id: post.postId});
    };

    @action
    addNewPost = async (post) => {
        post.postId = this.posts.length + 1;
        try {
            await addPost(post);
            // this.posts = [...this.posts, newPost];
            this.posts = await getAllPosts();
        } catch(error) {
            console.error(error)
        }
    };

    @action
    deletePost = async (postId) => {
        try {
            const data = await deletePostById(postId);
            if (data.deletedCount) {
                this.collectionDeletePost(postId);
            }
        } catch(error) {
            console.error(error)
        }
    };

    @action
    getPostData = (id) => {
        return _.find(this.posts, post => post._id === id);
    };

    collectionUpdatePost = post => {
        const index = _.findIndex(this.posts, {postId: post.postId});
        this.posts.splice(index, 1, post);
        this.posts = [...this.posts];
    };

    collectionDeletePost = id => {
        const index = _.findIndex(this.posts, {_id: id});
        this.posts.splice(index, 1);
        this.posts = [...this.posts];
    };
}
