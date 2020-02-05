import request from '@/router/axios';
export function getDepartmentUserTreeDataList(query) {
    return request({
        url: '/manage/statistics/userData/getDepartmentUserTreeDataList',
        method: 'get',
        params: query
    })
}
export function getUserCatalogDataList(query) {
    return request({
        url: '/manage/statistics/userData/getUserCatalogDataList',
        method: 'get',
        params: query
    })
}
