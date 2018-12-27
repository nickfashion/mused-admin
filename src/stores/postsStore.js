import { observable, action } from 'mobx';
import _ from 'lodash'
import { getPostsByType, addPost, addPostRetailer, deletePostById, deletePostRetailerById, updatePost, updatePostRetailer, getPostsRetailer } from '../services';
import { INSPIRE_POSTS, LIST_POSTS, PRODUCT_POSTS, INSTAGRAM_POSTS, MATCH_POSTS } from './constants';

export default class ObservableStore {
    constructor(root) { }

    @observable postsInspire = [];
    @observable postsList = [];
    @observable postsProduct = [];
    @observable postsInstagram = [];
    @observable postsRetailer = [];
    @observable postsMatch = [];


    get listOfPostsInspire() {
        return this.postsInspire;
    }

    get listOfPostsList() {
        return this.postsList;
    }

    get listOfPostsProduct() {
        return this.postsProduct;
    }

    get listOfPostsInstagram() {
        return this.postsInstagram;
    }

    get listOfPostsRetailer() {
        return this.postsRetailer;
    }

    get listOfPostsMatch() {
        return this.postsMatch;
    }

    @action
    getInspirePosts = async () => {
        this.postsInspire = await getPostsByType(INSPIRE_POSTS);
    };

    @action
    getListPosts = async () => {
        this.postsList = await getPostsByType(LIST_POSTS);
    };

    @action
    getProductPosts = async () => {
        this.postsProduct = await getPostsByType(PRODUCT_POSTS);
    };

    @action
    getInstagramPosts = async () => {
        this.postsInstagram = await getPostsByType(INSTAGRAM_POSTS);
    };

    @action
    getMatchPosts = async () => {
        this.postsMatch = await getPostsByType(MATCH_POSTS);
    };

    @action
    getRetailerPosts = async () => {
        this.postsRetailer = await getPostsRetailer();
    };

    @action
    setPostData = async (post, postType) => {
        const updatedPost = postType === 'postsRetailer'
            ? await updatePostRetailer(post)
            : await updatePost(post);
        this.collectionUpdatePost({ ...updatedPost, postId: post.postId }, postType);
    };

    @action
    addNewPostInspire = async (post) => {
        try {
            await addPost(post);
            await this.getInspirePosts();
        } catch (error) {
            console.error(error)
        }
    };

    @action
    addNewPostList = async (post) => {
        try {
            await addPost(post);
            await this.getListPosts();
        } catch (error) {
            console.error(error)
        }
    };

    @action
    addNewPostProduct = async (post) => {
        try {
            await addPost(post);
            await this.getProductPosts();
        } catch (error) {
            console.error(error)
        }
    };

    @action
    addNewPostInstagram = async (post) => {
        try {
            await addPost(post);
            await this.getInstagramPosts();
        } catch (error) {
            console.error(error)
        }
    };

    @action
    addNewPostMatch = async (post) => {
        try {
            await addPost(post);
            await this.getMatchPosts();
        } catch (error) {
            console.error(error)
        }
    };

    @action
    addNewPostRetailer = async (post) => {
        try {
            await addPostRetailer(post);
            await this.getRetailerPosts();
        } catch (error) {
            console.error(error)
        }
    };

    @action
    deletePost = async (postId, postType) => {
        try {
            const data = await deletePostById(postId);
            if (data.deletedCount) {
                this.collectionDeletePost(postId, postType);
            }
        } catch (error) {
            console.error(error)
        }
    };

    @action
    deletePostRetailer = async (postId, postType) => {
        try {
            const data = await deletePostRetailerById(postId);
            if (data.deletedCount) {
                this.collectionDeletePost(postId, postType);
            }
        } catch (error) {
            console.error(error)
        }
    };

    @action
    getPostData = (id, postType) => {
        return _.find(this[postType], post => post.postId === id);
    };

    collectionUpdatePost = (post, postType) => {
        const index = _.findIndex(this[postType], { postId: post.postId });
        this[postType].splice(index, 1, post);
        this[postType] = [...this[postType]];
    };

    collectionDeletePost = (id, postType) => {
        const index = _.findIndex(this[postType], { postId: id });
        this[postType].splice(index, 1);
        this[postType] = [...this[postType]];
    };
}
