"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const resp_handlers_1 = __importDefault(require("../../utils/resp-handlers"));
const posts_model_1 = __importDefault(require("../../models/posts/posts.model"));
const tags_model_1 = __importDefault(require("../../models/posts/tags.model"));
const helpers_1 = __importDefault(require("../../helpers"));
const enums_1 = require("../../enums");
const { POSTS } = enums_1.MODEL_NAMES;
const helpers = new helpers_1.default();
const responseHandlers = new resp_handlers_1.default();
class PostsController {
    createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { content, mediaUrl, mediaType, canBeLiked, allowsComments, tags = [], } = req.body;
            const { userId } = req.body.user;
            try {
                // --- check if content contains value or not ---
                if (helpers.isStringEmpty(content)) {
                    return responseHandlers.error(res, "Content cannot be empty");
                }
                // --- check if tags are present in the post ---
                let hasHashTags = (tags === null || tags === void 0 ? void 0 : tags.length) > 0;
                // --- validate hash tags to be sure they conform to starting with '#' keyword ---
                if (hasHashTags) {
                    if (!helpers.areHashtagsValid(tags)) {
                        return responseHandlers.error(res, "Invalid hash tags");
                    }
                }
                // --- initiate the Posts Model ---
                const newPost = new posts_model_1.default({
                    content,
                    mediaUrl,
                    mediaType,
                    canBeLiked,
                    allowsComments,
                    tags,
                    madeBy: userId,
                });
                const savedPost = yield newPost.save();
                if (hasHashTags) {
                    // --- create a promise to handle all tags write operations ---
                    const tagPromises = tags.map((tagName) => __awaiter(this, void 0, void 0, function* () {
                        let tag = yield tags_model_1.default.findOneAndUpdate({ tagName }, { $addToSet: { posts: savedPost._id } }, { new: true, upsert: true } // upsert is set to true to ensure new tag records are created if no existing ones
                        );
                        return tag.tagName;
                    }));
                    const tagNames = yield Promise.all(tagPromises);
                    savedPost.tags = tagNames;
                }
                // --- save again to  make the tags reflect in the already saved  post record ----
                yield savedPost.save();
                return responseHandlers.success(res, savedPost, "Post created successfully", 201);
            }
            catch (error) {
                return yield responseHandlers.mongoError(req, res, error, POSTS);
            }
        });
    }
    editPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { content, mediaUrl, mediaType, canBeLiked, allowsComments, tags = [], } = req.body;
            const updateData = {
                content,
                mediaUrl,
                mediaType,
                canBeLiked,
                allowsComments,
                tags,
            };
            const { userId } = req.body.user;
            const { postId } = req.params;
            try {
                // --- validate the post id  ---
                if (!postId || !helpers.isObjectIdValid(postId)) {
                    return responseHandlers.error(res, "Invalid post id");
                }
                // Check if the user is authorized to update the post and only return madeBy for performance sake ---
                const postToUpdate = yield posts_model_1.default.findOne({ _id: postId }).select("madeBy");
                if (!postToUpdate) {
                    return responseHandlers.error(res, "Post Not Found", 404);
                }
                if (postToUpdate.madeBy.toString() !== userId) {
                    return responseHandlers.error(res, "Unauthorized: User is not the author of this post", 401);
                }
                // --- check if tags are present in the post ---
                let hasHashTags = (tags === null || tags === void 0 ? void 0 : tags.length) > 0;
                if (hasHashTags) {
                    if (!helpers.areHashtagsValid(tags)) {
                        return responseHandlers.error(res, "Invalid hash tags");
                    }
                }
                // --- update the  post by  post id ---
                const updatedPost = yield posts_model_1.default.findOneAndUpdate({ _id: postId, madeBy: userId }, {
                    $set: updateData,
                }, {
                    new: true,
                });
                if (!updatedPost) {
                    return responseHandlers.error(res, "Post Not Found", 404);
                }
                if (hasHashTags) {
                    // --- create a promise to handle all tags write operations ---
                    const tagPromises = tags.map((tagName) => __awaiter(this, void 0, void 0, function* () {
                        let tag = yield tags_model_1.default.findOneAndUpdate({ tagName }, { $addToSet: { posts: postId } }, { new: true, upsert: true } // upsert is set to true to ensure new tag records are created if no existing ones
                        );
                        return tag.tagName;
                    }));
                    yield Promise.all(tagPromises);
                }
                return responseHandlers.success(res, updatedPost, "Post updated successfully", 201);
            }
            catch (error) {
                return yield responseHandlers.mongoError(req, res, error, POSTS);
            }
        });
    }
    deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.body.user;
            const { postId } = req.params;
            try {
                // --- validate the  post id  ---
                if (!postId || !helpers.isObjectIdValid(postId)) {
                    return responseHandlers.error(res, "Invalid post id");
                }
                // --- retrive the actual post and return only the madeBy(author) and tags ---
                const postToDelete = yield posts_model_1.default.findOne({ _id: postId }).select("madeBy tags");
                if (!postToDelete) {
                    return responseHandlers.error(res, "Post Not Found", 404);
                }
                // --- convert madeBy to string and check if it is the same as the userId for authorization ---
                if (postToDelete.madeBy.toString() !== userId) {
                    return responseHandlers.error(res, "Unauthorized: User is not the author of this post", 401);
                }
                const deletedPost = yield posts_model_1.default.deleteOne({ _id: postId });
                // --- if no post is delated ---
                if ((deletedPost === null || deletedPost === void 0 ? void 0 : deletedPost.deletedCount) === 0) {
                    return responseHandlers.error(res, "An error occurred", 400);
                }
                const hashTags = postToDelete.tags;
                if (hashTags.length > 0) {
                    // --- create a promise to handle all tags write operations ---
                    // --- the purpose of this part is to remove  the postId of the deleted post from each tag's posts array  ---
                    const tagPromises = hashTags.map((tagName) => __awaiter(this, void 0, void 0, function* () {
                        let tag = yield tags_model_1.default.findOneAndUpdate({ tagName }, { $pull: { posts: postId } }, { new: true });
                        return tag === null || tag === void 0 ? void 0 : tag.tagName;
                    }));
                    yield Promise.all(tagPromises);
                }
                /** it might be nice to delete all comments tied to a post
                but these comments may be  useful as data in future
                **/
                return responseHandlers.success(res, undefined, "Post deleted successfully", 200);
            }
            catch (error) {
                return yield responseHandlers.mongoError(req, res, error, POSTS);
            }
        });
    }
    fetchAllPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // --- retrieve the  pagination parameters
            const { pageSize, currentPage, filter } = helpers.pagination(req, "content");
            try {
                // --- count number of records in the collection ---
                const totalRecords = yield posts_model_1.default.countDocuments(filter);
                // --- retrieve the  records based  on the pagination parameters ---
                const posts = yield posts_model_1.default.find(filter)
                    .skip((currentPage - 1) * pageSize)
                    .limit(pageSize)
                    .sort({ _id: -1 })
                    .populate({
                    path: "madeBy",
                    select: "email firstName _id lastName picture",
                });
                // --- calculate number of pages based on the parameters  ---
                const totalPages = Math.ceil(totalRecords / pageSize);
                return responseHandlers.success(res, {
                    records: posts,
                    totalPages,
                    currentPage,
                    pageSize,
                    totalRecords,
                });
            }
            catch (error) {
                return yield responseHandlers.mongoError(req, res, error, POSTS);
            }
        });
    }
    fetchMyPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.body.user;
            // --- retrieve the  pagination parameters
            const { pageSize, currentPage, filter } = helpers.pagination(req, "content");
            try {
                // --- count number of records in the collection ---
                const totalRecords = yield posts_model_1.default.countDocuments(filter);
                // --- retrieve the  records based  on the pagination parameters ---
                const posts = yield posts_model_1.default.find(Object.assign({ madeBy: userId }, filter))
                    .skip((currentPage - 1) * pageSize)
                    .limit(pageSize)
                    .sort({ _id: -1 })
                    .populate({
                    path: "madeBy",
                    select: "email firstName _id lastName picture",
                }); // Adjust sorting as needed;
                // --- calculate number of pages based  on  the  parameters  ---
                const totalPages = Math.ceil(totalRecords / pageSize);
                return responseHandlers.success(res, {
                    records: posts,
                    totalPages,
                    currentPage,
                    pageSize,
                    totalRecords,
                });
            }
            catch (error) {
                return yield responseHandlers.mongoError(req, res, error, POSTS);
            }
        });
    }
    fetchPostById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { postId } = req.params;
            try {
                // --- validate the  post id  ---
                if (!postId || !helpers.isObjectIdValid(postId)) {
                    return responseHandlers.error(res, "Invalid post id");
                }
                // ---  retrive the particular post and populate its author(madeBy) key ---
                const post = yield posts_model_1.default.findById(postId).populate({
                    path: "madeBy",
                    select: "email firstName _id lastName picture",
                });
                if (!post) {
                    return responseHandlers.error(res, "Post Not Found", 404);
                }
                return responseHandlers.success(res, post);
            }
            catch (error) {
                return yield responseHandlers.mongoError(req, res, error, POSTS);
            }
        });
    }
    /**  ---
         * this method handles both  like and unlike.
         a post is unliked if called by a userId that  has  liked already
         ---
    **/
    likeAPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { postId } = req.params;
            const { userId } = req.body.user;
            try {
                // --- validate the  post id  ---
                if (!postId || !helpers.isObjectIdValid(postId)) {
                    return responseHandlers.error(res, "Invalid post id");
                }
                const post = yield posts_model_1.default.findById(postId).select("canBeLiked likes noOfLikes");
                if (!post) {
                    return responseHandlers.error(res, "Post Not Found", 404);
                }
                // --- check if the post can be liked ---
                if (!(post === null || post === void 0 ? void 0 : post.canBeLiked)) {
                    return responseHandlers.error(res, "Unauthorized: Post can not be liked", 401);
                }
                // --- Check if the user has already liked the post ---
                const findUserLikedIndex = post.likes.findIndex((id) => id === userId);
                if (findUserLikedIndex === -1) {
                    // --- if the user has not liked post ---
                    // --- Add the userId to the likes array and increment noOfLikes ---
                    post.likes.push(userId);
                    post.noOfLikes++;
                }
                else {
                    // --- remove the userId from the likes array and decrement noOfLikes ---
                    post.likes.splice(findUserLikedIndex, 1);
                    post.noOfLikes--;
                }
                // ---  Save the updated post ---
                yield post.save();
                return responseHandlers.success(res, post);
            }
            catch (error) {
                return yield responseHandlers.mongoError(req, res, error, POSTS);
            }
        });
    }
    searchPostsByTag(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // --- retrieve the  pagination parameters ---
            const { pageSize, currentPage } = helpers.pagination(req, "");
            const { tagName } = req.query;
            try {
                // --- check if tag is passed or not ---
                if (helpers.isStringEmpty(tagName)) {
                    return responseHandlers.error(res, "Invalid Tag");
                }
                // --- retrieve the  records based  on the pagination parameters ---
                const tagPost = yield tags_model_1.default.findOne({
                    tagName,
                }).populate({
                    path: "posts",
                    options: {
                        skip: (currentPage - 1) * pageSize,
                        limit: pageSize,
                        sort: { _id: -1 }, //
                    },
                });
                const { posts } = tagPost || {};
                return responseHandlers.success(res, {
                    records: posts || [],
                    currentPage,
                    pageSize,
                });
            }
            catch (error) {
                return yield responseHandlers.mongoError(req, res, error, POSTS);
            }
        });
    }
}
exports.default = PostsController;
