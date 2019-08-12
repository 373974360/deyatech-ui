import request from '@/router/axios';
export function getSiteManager(id) {
    return request({
        url: '/manage/monitor/siteManager/getBySiteManager',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateSiteManager(siteManagerVo){
    const data = siteManagerVo;
    return request({
        url: '/manage/monitor/siteManager/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delSiteManager(id) {
    const data = {id};
    return request({
        url: '/manage/monitor/siteManager/removeBySiteManager',
        method: 'post',
        data
    })
}
export function delSiteManagers(ids) {
    const data = {ids};
    return request({
        url: '/manage/monitor/siteManager/removeByIds',
        method: 'post',
        data
    })
}
export function getSiteManagerList(query) {
    return request({
        url: '/manage/monitor/siteManager/pageBySiteManager',
        method: 'get',
        params: query
    });
}


export function setSiteUsers(siteId, userIds) {
    return request({
        url: '/manage/monitor/siteManager/setSiteUsers',
        method: 'post',
        data: {siteId, userIds}
    })
}

export function setUserSites(userId, siteIds) {
    return request({
        url: '/manage/monitor/siteManager/setUserSites',
        method: 'post',
        data: {userId, siteIds}
    })
}

export function listBySiteManager(query) {
    return request({
        url: '/manage/monitor/siteManager/listBySiteManager',
        method: 'get',
        params: query
    })
}





