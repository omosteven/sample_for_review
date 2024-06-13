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
const tags_model_1 = __importDefault(require("../../models/posts/tags.model"));
const helpers_1 = __importDefault(require("../../helpers"));
const enums_1 = require("../../enums");
const { TAGS } = enums_1.MODEL_NAMES;
const responseHandlers = new resp_handlers_1.default();
const helpers = new helpers_1.default();
class TagsController {
    fetchAllTags(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { filter } = helpers.pagination(req, "tagName");
            try {
                // --- fetch all tags  with the filter and do not return their posts  ---
                const allTags = yield tags_model_1.default.find(filter).select("-posts");
                return responseHandlers.success(res, allTags);
            }
            catch (error) {
                return yield responseHandlers.mongoError(req, res, error, TAGS);
            }
        });
    }
}
exports.default = TagsController;
