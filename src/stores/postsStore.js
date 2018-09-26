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
        await updatePost(post);
        this.collectionUpdatePost(post);
    };

    @action
    addNewPost = async (post) => {
        post.postId = this.posts.length + 1;
        // TODO: test it
        try {
            const newPost = await addPost(post);
            this.posts = [...this.posts, newPost];
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
        return _.find(this.posts, post => post.postId === id);
    };

    collectionUpdatePost = post => {
        const index = _.findIndex(this.posts, {postId: post.postId});
        this.posts.splice(index, 1, _.merge(this.posts[index], post));
        this.posts = [...this.posts];
    };

    collectionDeletePost = id => {
        const index = _.findIndex(this.posts, {postId: id});
        this.posts.splice(index, 1);
        this.posts = [...this.posts];
    };
}
