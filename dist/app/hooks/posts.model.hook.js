"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("../../socket/events");
const socket_1 = require("../../socket");
const postsModelHook = (schema) => {
    // emit this event whenever a new post comes
    schema.post("save", function (doc) {
        socket_1.io.emit(events_1.NEW_POST_CREATION, doc);
    });
    //   emit  this event whenever a post is deleted
    schema.post("findOneAndDelete", function (doc) {
        socket_1.io.emit(events_1.POST_REMOVAL, doc);
    });
    //  emit this socket event whenever a post gets a new like, new comment, or edited
    schema.post("findOneAndUpdate", function (doc) {
        socket_1.io.emit(events_1.POST_UPDATE, doc);
    });
};
exports.default = postsModelHook;
