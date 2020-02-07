import request from '@/router/axios';
export function getDepartmentUserData(query) {
    return request({
        url: '/manage/statistics/userData/getDepartmentUserData',
        method: 'get',
        params: query
    })
}
export function getUserCatalogData(query) {
    return request({
        url: '/manage/statistics/userData/getUserCatalogData',
        method: 'get',
        params: query
    })
}
export function getUserCatalogTemplateData(query) {
    return request({
        url: '/manage/statistics/userData/getUserCatalogTemplateData',
        method: 'get',
        params: query
    })
}
