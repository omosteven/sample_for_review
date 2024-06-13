"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaController = exports.TagsController = exports.PostsController = exports.CommentsController = exports.ProfileController = exports.AuthController = void 0;
var auth_controller_1 = require("./users/auth.controller");
Object.defineProperty(exports, "AuthController", { enumerable: true, get: function () { return __importDefault(auth_controller_1).default; } });
var profile_controller_1 = require("./users/profile.controller");
Object.defineProperty(exports, "ProfileController", { enumerable: true, get: function () { return __importDefault(profile_controller_1).default; } });
var comments_controller_1 = require("./posts/comments.controller");
Object.defineProperty(exports, "CommentsController", { enumerable: true, get: function () { return __importDefault(comments_controller_1).default; } });
var posts_controller_1 = require("./posts/posts.controller");
Object.defineProperty(exports, "PostsController", { enumerable: true, get: function () { return __importDefault(posts_controller_1).default; } });
var tags_controller_1 = require("./posts/tags.controller");
Object.defineProperty(exports, "TagsController", { enumerable: true, get: function () { return __importDefault(tags_controller_1).default; } });
var media_controller_1 = require("./media/media.controller");
Object.defineProperty(exports, "MediaController", { enumerable: true, get: function () { return __importDefault(media_controller_1).default; } });
