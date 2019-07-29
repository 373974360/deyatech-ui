import request from '@/router/axios';
export function getGroupSite(id) {
    return request({
        url: '/manage/monitor/groupSite/getByGroupSite',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateGroupSite(groupSiteVo){
    const data = groupSiteVo;
    return request({
        url: '/manage/monitor/groupSite/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delGroupSite(id) {
    const data = {id};
    return request({
        url: '/manage/monitor/groupSite/removeByGroupSite',
        method: 'post',
        data
    })
}
export function delGroupSites(ids) {
    const data = {ids};
    return request({
        url: '/manage/monitor/groupSite/removeByIds',
        method: 'post',
        data
    })
}
export function getGroupSiteList(query) {
    return request({
        url: '/manage/monitor/groupSite/pageByGroupSite',
        method: 'get',
        params: query
    });
}


