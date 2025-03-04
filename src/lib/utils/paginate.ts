export const getPaginateOptions = (page: any, limit: any, options?: any) => {
    return {
        page: parseInt(String(page), 10),
        limit: parseInt(String(limit), 10),
        sort: { createdAt: -1 },
        ...options
    };
};

export const transformPaginateResponse = (data: any) => {
    return {
        data: data.docs,
        totalDocs: data.totalDocs,
        limit: data.limit,
        totalPages: data.totalPages,
        page: data.page,
        pagingCounter: data.pagingCounter,
        hasPrevPage: data.hasPrevPage,
        hasNextPage: data.hasNextPage,
        prevPage: data.prevPage,
        nextPage: data.nextPage
    }
}