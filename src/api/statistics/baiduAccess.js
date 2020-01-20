import request from '@/router/axios';
export function getOutline(query) {
    return request({
        url: '/manage/statistics/baiduAccess/getOutline',
        method: 'get',
        params: query
    })
}
export function getWord(query) {
    return request({
        url: '/manage/statistics/baiduAccess/getWord',
        method: 'get',
        params: query
    })
}
export function getVisitPage(query) {
    return request({
        url: '/manage/statistics/baiduAccess/getVisitPage',
        method: 'get',
        params: query
    })
}
export function getSourceSite(query) {
    return request({
        url: '/manage/statistics/baiduAccess/getSourceSite',
        method: 'get',
        params: query
    })
}
export function getLandingPage(query) {
    return request({
        url: '/manage/statistics/baiduAccess/getLandingPage',
        method: 'get',
        params: query
    })
}
export function getVisitorType(query) {
    return request({
        url: '/manage/statistics/baiduAccess/getVisitorType',
        method: 'get',
        params: query
    })
}
export function getDistrictRpt(query) {
    return request({
        url: '/manage/statistics/baiduAccess/getDistrictRpt',
        method: 'get',
        params: query
    })
}
export function getTimeTrendRpt(query) {
    return request({
        url: '/manage/statistics/baiduAccess/getTimeTrendRpt',
        method: 'get',
        params: query
    })
}
export function getAge(query) {
    return request({
        url: '/manage/statistics/baiduAccess/getAge',
        method: 'get',
        params: query
    })
}

