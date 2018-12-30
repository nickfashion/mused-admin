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

export const getPostsSinCol = (collectionType) => {
    const client = getClient();
    return client.callFunction("getPostsSinCol", [collectionType]);
}

export const addPost = (post) => {
    const client = getClient();
    return client.callFunction("addPost", [ post ]);
};

export const addPostSinCol = (post, collectionType) => {
    const client = getClient();
    return client.callFunction("addPostSinCol", [ post, collectionType]);
};

export const deletePostById = (postId) => {
    const client = getClient();
    return client.callFunction("deletePostById", [ postId ]);
};

export const deletePostSinColById = (postId, collectionType) => {
    const client = getClient();
    return client.callFunction("deletePostSinColById", [ postId, collectionType]);
};

export const updatePost = (post) => {
    const client = getClient();
    return client.callFunction("updatePost", [ post ]);
};

export const updatePostSinCol = (post, collectionType) => {
    const client = getClient();
    return client.callFunction("updatePostSinCol", [ post, collectionType]);
};
