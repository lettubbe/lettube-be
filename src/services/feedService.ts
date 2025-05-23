import { sortModeType } from "../lib/interfaces/filter.interface";
import { getPaginateOptions } from "../lib/utils/paginate";
import Post from "../models/Feed/Post";

export const getPostsQuery = async (
    {
        page = 1,
        limit = 10,
        search = "",
        mode = "latest"
    }: {
        page: number;
        limit: number;
        search: string;
        mode: sortModeType;
    }) => {



    const options = getPaginateOptions(page, limit);

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

    return options
}

export function feedtransformedPostData(
  posts: any[],
  {
    bookmarkedPostIds,
    viewCountsMap,
  }: {
    bookmarkedPostIds: Set<string>;
    viewCountsMap: Map<string, number>;
  }
) {
  return posts.map((post) => {
    const postObj = post.toObject();
    const postIdStr = postObj._id.toString();

    const topLevelComments = postObj.comments || [];
    const totalReplies = topLevelComments.reduce(
      (sum: number, comment: any) => sum + (comment.replies?.length || 0),
      0
    );
    const commentCount = topLevelComments.length + totalReplies;

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
