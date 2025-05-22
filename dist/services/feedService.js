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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostsQuery = void 0;
const paginate_1 = require("../lib/utils/paginate");
const getPostsQuery = (_a) => __awaiter(void 0, [_a], void 0, function* ({ page = 1, limit = 10, search = "", mode = "latest" }) {
    const options = (0, paginate_1.getPaginateOptions)(page, limit);
    // Add 
    // 
    // sorting based on mode
    switch (mode) {
        case 'most-popular':
            options.sort = {
                views: -1,
                likes: -1,
                createdAt: -1
            };
            break;
        case 'most-liked':
            options.sort = {
                likes: -1,
                createdAt: -1
            };
            break;
        case 'oldest':
            options.sort = { createdAt: 1 };
            break;
        case 'latest':
        default:
            options.sort = { createdAt: -1 };
            break;
    }
    if (search) {
        options.or([
            { description: { $regex: search, $options: 'i' } },
            { tags: { $regex: search, $options: 'i' } },
            { category: { $regex: search, $options: 'i' } }
        ]);
    }
    return options;
});
exports.getPostsQuery = getPostsQuery;
