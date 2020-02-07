import request from '@/router/axios';

export function getCatalogCountList(query) {
    return request({
        url: '/manage/statistics/catalogData/getCatalogCountList',
        method: 'get',
        params: query
    })
}
