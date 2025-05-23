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
exports.feedtransformedPostData = feedtransformedPostData;
const paginate_1 = require("../lib/utils/paginate");
const getPostsQuery = (_a) => __awaiter(void 0, [_a], void 0, function* ({ page = 1, limit = 10, search = "", mode = "latest" }) {
    const options = (0, paginate_1.getPaginateOptions)(page, limit);
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
function feedtransformedPostData(posts, { bookmarkedPostIds, viewCountsMap, }) {
    return posts.map((post) => {
        const postObj = post.toObject();
        const postIdStr = postObj._id.toString();
        const topLevelComments = postObj.comments || [];
        const totalReplies = topLevelComments.reduce((sum, comment) => { var _a; return sum + (((_a = comment.replies) === null || _a === void 0 ? void 0 : _a.length) || 0); }, 0);
        const commentCount = topLevelComments.length + totalReplies;
        console.log("commentCount", commentCount);
        return {
            _id: postObj._id,
            user: {
                _id: postObj.user._id,
                username: postObj.user.username,
                firstName: postObj.user.firstName,
                lastName: postObj.user.lastName,
                profilePicture: postObj.user.profilePicture,
            },
            category: postObj.category,
            thumbnail: postObj.thumbnail,
            videoUrl: postObj.videoUrl,
            description: postObj.description,
            visibility: postObj.visibility,
            tags: postObj.tags,
            isCommentsAllowed: postObj.isCommentsAllowed,
            reactions: postObj.reactions,
            comments: postObj.comments,
            createdAt: postObj.createdAt,
            updatedAt: postObj.updatedAt,
            duration: postObj.duration,
            isBookmarked: bookmarkedPostIds.has(postIdStr),
            views: viewCountsMap.get(postIdStr) || 0,
            commentCount,
        };
    });
}
