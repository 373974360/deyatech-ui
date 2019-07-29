import request from '@/router/axios';
export function getSite(id) {
    return request({
        url: '/manage/monitor/site/getBySite',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateSite(siteVo){
    const data = siteVo;
    return request({
        url: '/manage/monitor/site/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delSite(id) {
    const data = {id};
    return request({
        url: '/manage/monitor/site/removeBySite',
        method: 'post',
        data
    })
}
export function delSites(ids) {
    const data = {ids};
    return request({
        url: '/manage/monitor/site/removeByIds',
        method: 'post',
        data
    })
}
export function getSiteList(query) {
    return request({
        url: '/manage/monitor/site/pageBySite',
        method: 'get',
        params: query
    });
}


