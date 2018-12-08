import { getClient, login } from './db';

export const loginEmailPassword = login;

export const getAuthUserData = () => {
    const client = getClient();
    if (!client.auth.isLoggedIn) return null;

    const { user: { id, profile } } = client.auth;
    return {
        userAuthId: id,
        userProfile: profile.data,
    };
};

export const logout = () => {
    const client = getClient();
    return client.auth.logout();
};

export const getAllProducts = () => {
    const client = getClient();
    return client.callFunction("getProducts");
};

export const getPostsByType = (type) => {
    const client = getClient();
    return client.callFunction("getPostsByType", [type]);
};

export const getPostsRetailer = (type) => {
    const client = getClient();
    return client.callFunction("getPostsRetailer");
}

export const addPost = (post) => {
    const client = getClient();
    return client.callFunction("addPost", [ post ]);
};

export const addPostRetailer = (post) => {
    const client = getClient();
    return client.callFunction("addPostRetailer", [ post ]);
};

export const deletePostById = (postId) => {
    const client = getClient();
    return client.callFunction("deletePostById", [ postId ]);
};

export const deletePostRetailerById = (postId) => {
    const client = getClient();
    return client.callFunction("deletePostRetailerById", [ postId ]);
};

export const updatePost = (post) => {
    const client = getClient();
    return client.callFunction("updatePost", [ post ]);
};

export const updatePostRetailer = (post) => {
    const client = getClient();
    return client.callFunction("updatePostRetailer", [ post ]);
};
