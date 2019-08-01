import request from '@/router/axios';
export function getPreorderBlacklist(id) {
    return request({
        url: '/manage/number/preorderBlacklist/getByPreorderBlacklist',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdatePreorderBlacklist(preorderBlacklistVo){
    const data = preorderBlacklistVo;
    return request({
        url: '/manage/number/preorderBlacklist/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delPreorderBlacklist(id) {
    const data = {id};
    return request({
        url: '/manage/number/preorderBlacklist/removeByPreorderBlacklist',
        method: 'post',
        data
    })
}
export function delPreorderBlacklists(ids) {
    const data = {ids};
    return request({
        url: '/manage/number/preorderBlacklist/removeByIds',
        method: 'post',
        data
    })
}
export function getPreorderBlacklistList(query) {
    return request({
        url: '/manage/number/preorderBlacklist/pageByPreorderBlacklist',
        method: 'get',
        params: query
    });
}


