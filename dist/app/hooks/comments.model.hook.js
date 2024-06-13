"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("../../socket/events");
const socket_1 = require("../../socket");
const commentsModelHook = (schema) => {
    // emit this event whenever a post gets a new comment
    schema.post("save", function (doc) {
        socket_1.io.emit(events_1.NEW_POST_COMMENT, doc);
    });
    // emit  this event whenever a comment is deleted
    schema.post("findOneAndDelete", function (doc) {
        socket_1.io.emit(events_1.POST_COMMENT_REMOVAL, doc);
    });
    //  emit this socket event whenever a comment is edited
    schema.post("findOneAndUpdate", function (doc) {
        socket_1.io.emit(events_1.POST_COMMENT_UPDATE, doc);
    });
};
exports.default = commentsModelHook;
