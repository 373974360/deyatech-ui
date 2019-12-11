import request from '@/router/axios';

export function getPageCatalogList(query) {
    return request({
        url: '/manage/station/pageCatelog/listByPageCatalog',
        method: 'get',
        params: query
    });
}

