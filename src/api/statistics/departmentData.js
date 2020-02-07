import request from '@/router/axios';
export function getDepartmentData(query) {
    return request({
        url: '/manage/statistics/departmentData/getDepartmentData',
        method: 'get',
        params: query
    })
}
export function getDepartmentCatalogData(query) {
    return request({
        url: '/manage/statistics/departmentData/getDepartmentCatalogData',
        method: 'get',
        params: query
    })
}
export function getDepartmentCatalogTemplateData(query) {
    return request({
        url: '/manage/statistics/departmentData/getDepartmentCatalogTemplateData',
        method: 'get',
        params: query
    })
}
