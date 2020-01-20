import request from '@/router/axios';
export function getTemplateAccess(id) {
    return request({
        url: '/manage/statistics/templateAccess/getByTemplateAccess',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateTemplateAccess(templateAccessVo){
    const data = templateAccessVo;
    return request({
        url: '/manage/statistics/templateAccess/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delTemplateAccess(id) {
    const data = {id};
    return request({
        url: '/manage/statistics/templateAccess/removeByTemplateAccess',
        method: 'post',
        data
    })
}
export function delTemplateAccesss(ids) {
    const data = {ids};
    return request({
        url: '/manage/statistics/templateAccess/removeByIds',
        method: 'post',
        data
    })
}
export function getTemplateAccessList(query) {
    return request({
        url: '/manage/statistics/templateAccess/pageByTemplateAccess',
        method: 'get',
        params: query
    });
}


