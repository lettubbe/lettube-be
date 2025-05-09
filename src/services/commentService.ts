import { Types } from 'mongoose';
import Post from '../models/Post';

type SortMode = 'top' | 'most-liked' | 'newest';

export const getCommentsQuery = (
    postId: string,
    {
        page = 1,
        limit = 10,
        search = "",
        mode = "newest"
    }: {
        page: number;
        limit: number;
        search: string;
        mode: SortMode;
    }
) => {
    const query = Post.findById(postId);

    if (search) {
        query.or([
            { 'comments.text': { $regex: search, $options: 'i' } },
            { 'comments.replies.text': { $regex: search, $options: 'i' } }
        ]);
    }

    // Apply sorting based on mode
    switch (mode) {
        case 'top':
            // Sort by number of replies and likes combined
            query.sort({
                'comments.replies': -1,
                'comments.likes': -1,
                'comments.createdAt': -1
            });
            break;
        case 'most-liked':
            // Sort by number of likes
            query.sort({
                'comments.likes': -1,
                'comments.createdAt': -1
            });
            break;
        case 'newest':
        default:
            // Sort by creation date (newest first)
            query.sort({ 'comments.createdAt': -1 });
            break;
    }

    // Add population
    query.populate({
        path: 'comments.user',
        select: 'email isDeleted date createdAt updatedAt password firstName lastName username dob profilePicture'
    })
        .populate({
            path: 'comments.replies.user',
            select: 'email isDeleted date createdAt updatedAt password firstName lastName username dob profilePicture'
        });

    // Add pagination to comments
    query.slice('comments', [(Number(page) - 1) * Number(limit), Number(limit)]);

    return query;
};