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
const helpers_1 = __importDefault(require("../../helpers"));
const comments_model_1 = __importDefault(require("../../models/posts/comments.model"));
const posts_model_1 = __importDefault(require("../../models/posts/posts.model"));
const enums_1 = require("../../enums");
const { COMMENTS } = enums_1.MODEL_NAMES;
const responseHandlers = new resp_handlers_1.default();
const helpers = new helpers_1.default();
class CommentsController {
    addCommentToPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.body.user;
            const { postId } = req.params;
            const { content } = req.body;
            try {
                // --- check if content is empty or not ---
                if (helpers.isStringEmpty(content)) {
                    return responseHandlers.error(res, "Please add a comment content");
                }
                // --- check if postId is a valid object
                if (!postId || !helpers.isObjectIdValid(postId)) {
                    return responseHandlers.error(res, "Invalid post id");
                }
                // --- retrive the actual post and only return allowsComments, noOfComments
                const post = yield posts_model_1.default.findById(postId).select("allowsComments noOfComments");
                if (!post) {
                    return responseHandlers.error(res, "Post Not Found", 404);
                }
                // --- perform authorization to check if the post is allowed to have comments or not ---
                if (!post.allowsComments) {
                    return responseHandlers.error(res, "Unauthorized: Post does not allow comments", 401);
                }
                const newComment = new comments_model_1.default({
                    post: postId,
                    content,
                    user: userId,
                });
                (yield newComment.save()).populate({
                    path: "user",
                    select: "email firstName _id lastName picture",
                });
                // --- increment number of comments ---
                post.noOfComments++;
                post.save();
                return responseHandlers.success(res, newComment, "Comment added", 201);
            }
            catch (error) {
                return yield responseHandlers.mongoError(req, res, error, COMMENTS);
            }
        });
    }
    editCommentById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.body.user;
            const { commentId } = req.params;
            const { content } = req.body;
            try {
                // --- check if  the content has value ---
                if (helpers.isStringEmpty(content)) {
                    return responseHandlers.error(res, "Comment cannot be empty");
                }
                // --- retrive and update the comment, also populate it with the actual user performing the edit action ---
                const updatedComment = yield comments_model_1.default.findOneAndUpdate({
                    _id: commentId,
                    user: userId,
                }, { $set: { content } }, { new: true }).populate({
                    path: "user",
                    select: "email firstName _id lastName picture",
                });
                if (!commentId || !helpers.isObjectIdValid(commentId)) {
                    return responseHandlers.error(res, "Invalid comment id");
                }
                if (!updatedComment) {
                    return responseHandlers.error(res, "Failed to update comment");
                }
                return responseHandlers.success(res, updatedComment, "Comment updated", 201);
            }
            catch (error) {
                return responseHandlers.mongoError(req, res, error, COMMENTS);
            }
        });
    }
    deleteCommentById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.body.user;
            const { commentId } = req.params;
            try {
                if (!commentId || !helpers.isObjectIdValid(commentId)) {
                    return responseHandlers.error(res, "Invalid comment id");
                }
                // --- we assume the comment was made by the user ---
                // --- checking separately if it was made by the user using another query operation  will increase the request time ---
                const deletedComment = yield comments_model_1.default.findOneAndDelete({
                    _id: commentId,
                    user: userId,
                }).select("post");
                // --- was there a successful  delete operation? ---
                if (!deletedComment) {
                    return responseHandlers.error(res, "Failed to delete comment");
                }
                const postId = deletedComment.post;
                // --- decrement the noOfComments key by 1---
                yield posts_model_1.default.updateOne({ _id: postId }, { $inc: { noOfComments: -1 } } // decrement by 1
                );
                return responseHandlers.success(res, undefined, "Post delete successfully", 200);
            }
            catch (error) {
                return responseHandlers.mongoError(req, res, error, COMMENTS);
            }
        });
    }
    fetchAllCommentsByPostId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { postId } = req.params;
            try {
                if (!postId || !helpers.isObjectIdValid(postId)) {
                    return responseHandlers.error(res, "Invalid comment id");
                }
                const comments = yield comments_model_1.default.find({ post: postId }).populate({
                    path: "user",
                    select: "email firstName _id lastName picture",
                });
                return responseHandlers.success(res, comments || []);
            }
            catch (error) {
                return responseHandlers.mongoError(req, res, error, COMMENTS);
            }
        });
    }
}
exports.default = CommentsController;
