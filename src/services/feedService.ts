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

    return options
}