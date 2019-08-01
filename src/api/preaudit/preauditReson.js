import request from '@/router/axios';
export function getPreauditReson(query) {
    return request({
        url: '/manage/preaudit/preauditReson/getByPreauditReson',
        method: 'get',
        params: query
    })
}

export function createOrUpdatePreauditReson(preauditResonVo){
    const data = preauditResonVo;
    return request({
        url: '/manage/preaudit/preauditReson/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delPreauditReson(id) {
    const data = {id};
    return request({
        url: '/manage/preaudit/preauditReson/removeByPreauditReson',
        method: 'post',
        data
    })
}
export function delPreauditResons(ids) {
    const data = {ids};
    return request({
        url: '/manage/preaudit/preauditReson/removeByIds',
        method: 'post',
        data
    })
}
export function getPreauditResonList(query) {
    return request({
        url: '/manage/preaudit/preauditReson/pageByPreauditReson',
        method: 'get',
        params: query
    });
}
export function getAllPreauditReson(query) {
    return request({
        url: '/manage/preaudit/preauditReson/listByPreauditReson',
        method: 'get',
        params: query
    });
}
