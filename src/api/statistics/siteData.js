import request from '@/router/axios';

export function getSiteCountList(query) {
    return request({
        url: '/manage/statistics/siteData/getSiteCountList',
        method: 'get',
        params: query
    })
}
